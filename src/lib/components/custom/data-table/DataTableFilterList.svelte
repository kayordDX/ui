<script lang="ts" generics="TData extends RowData">
	import CalendarIcon from "@lucide/svelte/icons/calendar";
	import Check from "@lucide/svelte/icons/check";
	import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
	import Copy from "@lucide/svelte/icons/copy";
	import ListFilter from "@lucide/svelte/icons/list-filter";
	import Trash2 from "@lucide/svelte/icons/trash-2";
	import { getLocalTimeZone, parseAbsoluteToLocal, toCalendarDate } from "@internationalized/date";
	import type { CalendarDate, DateValue } from "@internationalized/date";
	import type { Column, RowData, Table } from "@tanstack/svelte-table";
	import type { DataTableFeatures } from "./features";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Calendar } from "$lib/components/ui/calendar";
	import { RangeCalendar } from "$lib/components/ui/range-calendar";
	import * as Command from "$lib/components/ui/command";
	import * as Popover from "$lib/components/ui/popover";
	import * as Select from "$lib/components/ui/select";
	import type { ColumnFiltersState } from "@tanstack/svelte-table";
	import {
		getFilterOperators,
		isInactiveFilter,
		type ExtendedColumnFilter,
		type FilterOperator,
		type FilterVariant,
	} from "./filter-list-utils";
	import { cn } from "$lib/utils";

	type AppColumn = Column<DataTableFeatures, TData>;

	interface Props {
		table: Table<DataTableFeatures, TData>;
		/** Render the live QueryKit filter string with a copy button (needs `querykit-builder` installed). */
		queryKit?: boolean;
		class?: string;
	}

	let { table, queryKit = false, class: className }: Props = $props();

	const columnFilters = $derived(table.atoms.columnFilters.get() as Array<ExtendedColumnFilter>);
	const activeFilterCount = $derived(columnFilters.filter((filter) => !isInactiveFilter(filter)).length);

	const setColumnFilters = (filters: Array<ExtendedColumnFilter>) => {
		table.options.onColumnFiltersChange?.(filters as ColumnFiltersState);
	};

	const uid = $props.id();
	const labelId = `${uid}-label`;
	const descriptionId = `${uid}-description`;
	let open = $state(false);

	const filterableColumns = $derived(table.getAllColumns().filter((column) => column.getCanFilter()));

	function getColumnFilterVariant(column: AppColumn): FilterVariant {
		if (column.columnDef.meta?.variant) {
			return column.columnDef.meta.variant;
		}

		const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);

		if (Array.isArray(firstValue)) return "multi-select";
		if (typeof firstValue === "number") return "number";
		if (firstValue instanceof Date) return "date";

		return "text";
	}

	function isoToCalendarDate(iso: unknown): CalendarDate | undefined {
		if (typeof iso !== "string" || !iso) return undefined;
		try {
			return toCalendarDate(parseAbsoluteToLocal(iso));
		} catch {
			return undefined;
		}
	}

	function dateValueToISO(value: DateValue | undefined): string | undefined {
		return value ? value.toDate(getLocalTimeZone()).toISOString() : undefined;
	}

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	}

	function getColumnOptions(column: AppColumn): Array<{ label: string; value: string; count?: number }> {
		const customOptions = column.columnDef.meta?.options;
		if (customOptions) return customOptions;

		const uniqueValues = column.getFacetedUniqueValues();
		return Array.from(uniqueValues.entries()).map(([value, count]: [unknown, number]) => ({
			label: String(value),
			value: String(value),
			count,
		}));
	}

	function onFilterAdd() {
		const firstFilterableColumn = filterableColumns[0];
		if (!firstFilterableColumn) return;

		const filterVariant = getColumnFilterVariant(firstFilterableColumn);
		const operators = getFilterOperators(filterVariant);

		setColumnFilters([
			...columnFilters,
			{
				id: firstFilterableColumn.id,
				value: filterVariant === "multi-select" ? [] : "",
				operator: operators[0].value,
				filterId: crypto.randomUUID(),
				joinOperator: "and",
			},
		]);
	}

	function onFilterUpdate(filterId: string, updates: Partial<Omit<ExtendedColumnFilter, "filterId">>) {
		const newFilters = columnFilters.map((filter) => {
			if (filter.filterId === filterId) {
				if (updates.id) {
					const newColumn = filterableColumns.find((col) => col.id === updates.id);
					if (newColumn) {
						const filterVariant = getColumnFilterVariant(newColumn);
						const operators = getFilterOperators(filterVariant);
						return {
							...filter,
							...updates,
							operator: operators[0].value,
							value: filterVariant === "multi-select" ? [] : "",
						};
					}
				}

				if (updates.operator && filter.value) {
					const column = filterableColumns.find((col) => col.id === filter.id);
					if (column && getColumnFilterVariant(column) === "date") {
						const currentValue = filter.value;
						if (updates.operator === "inRange" && !Array.isArray(currentValue)) {
							return {
								...filter,
								...updates,
								value: [currentValue, undefined],
							};
						} else if (updates.operator !== "inRange" && Array.isArray(currentValue)) {
							return {
								...filter,
								...updates,
								value: currentValue[0] ?? "",
							};
						}
					}
				}

				return { ...filter, ...updates };
			}
			return filter;
		});
		setColumnFilters(newFilters);
	}

	function onFilterRemove(filterId: string) {
		setColumnFilters(columnFilters.filter((filter) => filter.filterId !== filterId));
	}

	function toggleOptionValue(filterId: string, multiple: boolean, optionValue: string, current: unknown) {
		if (multiple) {
			const currentValues = Array.isArray(current) ? current.map(String) : [];
			const next = currentValues.includes(optionValue)
				? currentValues.filter((v) => v !== optionValue)
				: [...currentValues, optionValue];
			onFilterUpdate(filterId, { value: next });
		} else {
			onFilterUpdate(filterId, { value: current === optionValue ? "" : optionValue });
		}
	}

	let queryKitFilter = $state("");
	let copied = $state(false);

	$effect(() => {
		if (!queryKit) return;
		import("$lib/query-kit/query-kit-filter").then(({ toQueryKitFilter }) => {
			queryKitFilter = toQueryKitFilter(columnFilters);
		});
	});

	async function copyQueryKitFilter() {
		await navigator.clipboard.writeText(queryKitFilter);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="outline" size="sm" class={cn("[&_svg]:size-3", className)}>
				<ListFilter />
				Filter
				{#if activeFilterCount > 0}
					<Badge
						variant="secondary"
						class="h-[1.14rem] rounded-[0.2rem] px-[0.32rem] font-mono text-[0.65rem] font-normal"
					>
						{activeFilterCount}
					</Badge>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		aria-describedby={descriptionId}
		aria-labelledby={labelId}
		align="start"
		class="flex w-[calc(100vw-theme(spacing.12))] min-w-60 origin-(--transform-origin) flex-col gap-3 p-4 sm:w-fit sm:min-w-80"
	>
		<div class="flex flex-col gap-1">
			<h4 id={labelId} class="leading-none font-medium">Filters</h4>
			<p id={descriptionId} class={cn("text-muted-foreground text-sm", columnFilters.length > 0 && "sr-only")}>
				{columnFilters.length > 0 ? "Modify filters to refine your results." : "Add filters to refine your results."}
			</p>
		</div>
		{#if columnFilters.length > 0}
			<div role="list" class="flex max-h-[300px] flex-col gap-2 overflow-y-auto p-0.5">
				{#each columnFilters as filter, index (filter.filterId)}
					{@render FilterRow({ filter, index })}
				{/each}
			</div>
		{/if}
		<div class="flex items-center gap-2">
			<Button size="sm" onclick={onFilterAdd} aria-label="Add new filter">Add filter</Button>
			{#if columnFilters.length > 0}
				<Button aria-label="Reset all filters" variant="outline" size="sm" onclick={() => setColumnFilters([])}>
					Reset filters
				</Button>
			{/if}
		</div>
		{#if queryKit}
			<div class="bg-muted/40 flex items-center gap-2 rounded-md border px-2 py-1.5">
				<code class="min-w-0 flex-1 truncate font-mono text-xs">{queryKitFilter || "No active filters"}</code>
				<Button
					size="icon"
					variant="ghost"
					class="size-6 shrink-0 [&_svg]:size-3"
					aria-label="Copy query"
					disabled={!queryKitFilter}
					onclick={copyQueryKitFilter}
				>
					{#if copied}
						<Check />
					{:else}
						<Copy />
					{/if}
				</Button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>

{#snippet FilterRow({ filter, index }: { filter: ExtendedColumnFilter; index: number })}
	{@const column = table.getColumn(filter.id)}
	{#if column && filter.filterId}
		{@const filterVariant = getColumnFilterVariant(column)}
		{@const operators = getFilterOperators(filterVariant)}
		{@const filterItemId = `${uid}-filter-${filter.filterId}`}
		{@const fieldListboxId = `${filterItemId}-field-listbox`}
		{@const operatorListboxId = `${filterItemId}-operator-listbox`}
		{@const inputId = `${filterItemId}-input`}
		{@const currentOperator = filter.operator ?? operators[0].value}
		{@const columnLabel = column.columnDef.meta?.label ?? column.id}

		<div
			role="listitem"
			id={filterItemId}
			class="grid grid-cols-[70px_135px_125px_minmax(0,200px)_32px] items-center gap-2"
		>
			{#if index === 0}
				<span class="text-muted-foreground text-center text-sm">Where</span>
			{:else if index === 1}
				<Select.Root
					type="single"
					value={filter.joinOperator ?? "and"}
					onValueChange={(value) => {
						if (columnFilters.length > 0) {
							setColumnFilters(
								columnFilters.map((f) => ({
									...f,
									joinOperator: value as "and" | "or",
								}))
							);
						}
					}}
				>
					<Select.Trigger class="h-8" aria-label="Select join operator" aria-controls={fieldListboxId}>
						{filter.joinOperator ?? "and"}
					</Select.Trigger>
					<Select.Content id={`${filterItemId}-join-operator-listbox`}>
						<Select.Item value="and" label="and" />
						<Select.Item value="or" label="or" />
					</Select.Content>
				</Select.Root>
			{:else}
				<span class="text-muted-foreground text-center text-sm">
					{filter.joinOperator ?? "and"}
				</span>
			{/if}
			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							role="combobox"
							aria-controls={fieldListboxId}
							aria-label={`Select filter field. Current: ${columnLabel}`}
							variant="outline"
							size="sm"
							class="focus:ring-ring h-8 justify-between font-normal focus:ring-1 focus:outline-none"
						>
							<span class="truncate">
								{columnLabel}
							</span>
							<ChevronsUpDown class="opacity-50" />
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content id={fieldListboxId} class="w-[135px] p-0">
					<Command.Root>
						<Command.Input placeholder="Search columns..." aria-label="Search filterable columns" />
						<Command.List>
							<Command.Empty>No column found.</Command.Empty>
							<Command.Group>
								{#each filterableColumns as col (col.id)}
									{@const colLabel = col.columnDef.meta?.label ?? col.id}
									<Command.Item
										value={col.id}
										onSelect={() => {
											if (!filter.filterId) return;
											onFilterUpdate(filter.filterId, { id: col.id });
										}}
									>
										<span class="truncate">
											{colLabel}
										</span>
										<Check
											class={cn("ml-auto size-4", col.id === filter.id ? "opacity-100" : "opacity-0")}
											aria-hidden="true"
										/>
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<Select.Root
				type="single"
				value={currentOperator}
				onValueChange={(value) => {
					if (!filter.filterId) return;
					onFilterUpdate(filter.filterId, {
						operator: value as FilterOperator,
					});
				}}
			>
				<Select.Trigger class="h-8" aria-label="Select filter operator" aria-controls={operatorListboxId}>
					<span class="truncate">
						{operators.find((op) => op.value === currentOperator)?.label ?? "Select operator"}
					</span>
				</Select.Trigger>
				<Select.Content id={operatorListboxId}>
					{#each operators as op (op.value)}
						<Select.Item value={op.value} label={op.label} />
					{/each}
				</Select.Content>
			</Select.Root>
			{@render FilterInput({
				column,
				operator: currentOperator,
				filterId: filter.filterId,
				inputId,
			})}
			<Button
				variant="outline"
				size="icon"
				class="size-8 [&_svg]:size-3.5"
				aria-label={`Remove ${columnLabel} filter`}
				onclick={() => {
					if (!filter.filterId) return;
					onFilterRemove(filter.filterId);
				}}
			>
				<Trash2 />
			</Button>
		</div>
	{/if}
{/snippet}

{#snippet FilterInput({
	column,
	operator,
	filterId,
	inputId,
}: {
	column: AppColumn;
	operator: FilterOperator;
	filterId: string;
	inputId: string;
})}
	{@const filterVariant = getColumnFilterVariant(column)}
	{@const currentFilter = columnFilters.find((f) => f.filterId === filterId)}
	{@const columnLabel = column.columnDef.meta?.label ?? column.id}

	{#if filterVariant === "date"}
		{#if operator === "inRange"}
			{@const currentValue = Array.isArray(currentFilter?.value)
				? currentFilter.value
				: [currentFilter?.value, undefined]}
			{@const rangeStart = isoToCalendarDate(currentValue[0])}
			{@const rangeEnd = isoToCalendarDate(currentValue[1])}

			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							id={inputId}
							aria-controls={`${inputId}-calendar`}
							aria-label={`${columnLabel} date range filter`}
							variant="outline"
							size="sm"
							class={cn(
								"w-full justify-start text-left font-normal [&>svg]:size-3.5",
								!rangeStart && !rangeEnd && "text-muted-foreground"
							)}
						>
							<CalendarIcon />
							{#if currentValue[0]}
								{#if currentValue[1]}
									{formatDate(currentValue[0] as string)} - {formatDate(currentValue[1] as string)}
								{:else}
									{formatDate(currentValue[0] as string)}
								{/if}
							{:else}
								<span>Select date range</span>
							{/if}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content id={`${inputId}-calendar`} class="w-auto p-0" align="start">
					<RangeCalendar
						aria-label={`Select ${columnLabel} date range`}
						value={{ start: rangeStart, end: rangeEnd }}
						placeholder={rangeStart}
						onValueChange={(range) => {
							onFilterUpdate(filterId, {
								value: [dateValueToISO(range.start), dateValueToISO(range.end)],
								operator,
							});
						}}
						numberOfMonths={2}
					/>
				</Popover.Content>
			</Popover.Root>
		{:else}
			{@const selectedDate = isoToCalendarDate(currentFilter?.value)}

			<Popover.Root>
				<Popover.Trigger>
					{#snippet child({ props })}
						<Button
							{...props}
							id={inputId}
							aria-controls={`${inputId}-calendar`}
							aria-label={`${columnLabel} date filter`}
							variant="outline"
							size="sm"
							class={cn(
								"w-full justify-start text-left font-normal [&>svg]:size-3.5",
								!currentFilter?.value && "text-muted-foreground"
							)}
						>
							<CalendarIcon />
							{#if typeof currentFilter?.value === "string" && currentFilter.value}
								{formatDate(currentFilter.value)}
							{:else}
								<span class="text-muted-foreground">Pick a date</span>
							{/if}
						</Button>
					{/snippet}
				</Popover.Trigger>
				<Popover.Content id={`${inputId}-calendar`} class="w-auto p-0" align="start">
					<Calendar
						type="single"
						aria-label={`Select ${columnLabel} date`}
						value={selectedDate}
						placeholder={selectedDate}
						onValueChange={(date) => {
							onFilterUpdate(filterId, {
								value: dateValueToISO(date),
								operator,
							});
						}}
					/>
				</Popover.Content>
			</Popover.Root>
		{/if}
	{:else if filterVariant === "number"}
		{#if operator === "inRange"}
			{@const currentValue = Array.isArray(currentFilter?.value)
				? currentFilter.value
				: [currentFilter?.value, undefined]}

			<div class="flex items-center gap-2">
				<Input
					id={`${inputId}-min`}
					type="number"
					aria-label={`${columnLabel} minimum value`}
					value={(currentValue[0] as number | undefined) ?? ""}
					placeholder="Min"
					class="h-8"
					oninput={(event) => {
						onFilterUpdate(filterId, {
							value: [
								event.currentTarget.value === "" ? undefined : Number(event.currentTarget.value),
								currentValue[1] ?? undefined,
							],
							operator,
						});
					}}
				/>
				<Input
					id={`${inputId}-max`}
					type="number"
					aria-label={`${columnLabel} maximum value`}
					value={(currentValue[1] as number | undefined) ?? ""}
					placeholder="Max"
					class="h-8"
					oninput={(event) => {
						onFilterUpdate(filterId, {
							value: [
								currentValue[0] ?? undefined,
								event.currentTarget.value === "" ? undefined : Number(event.currentTarget.value),
							],
							operator,
						});
					}}
				/>
			</div>
		{:else}
			<Input
				id={inputId}
				type="number"
				aria-label={`${columnLabel} filter value`}
				value={(currentFilter?.value ?? "") as string}
				placeholder="Enter number..."
				class="h-8"
				oninput={(event) => {
					onFilterUpdate(filterId, {
						value: event.currentTarget.value === "" ? "" : Number(event.currentTarget.value),
						operator,
					});
				}}
			/>
		{/if}
	{:else if filterVariant === "select" || filterVariant === "multi-select"}
		{@const options = getColumnOptions(column)}
		{@const multiple = filterVariant === "multi-select"}
		{@const selectedValues = Array.isArray(currentFilter?.value)
			? (currentFilter.value as Array<string>)
			: typeof currentFilter?.value === "string" && currentFilter.value
				? [currentFilter.value]
				: []}

		<Popover.Root>
			<Popover.Trigger>
				{#snippet child({ props })}
					<Button
						{...props}
						id={inputId}
						aria-controls={`${inputId}-listbox`}
						aria-label={multiple ? `${columnLabel} filter values` : `${columnLabel} filter value`}
						variant="outline"
						size="sm"
						class="h-8 w-full justify-start text-left font-normal"
					>
						<span class="truncate">
							{#if selectedValues.length === 0}
								<span class="text-muted-foreground">Select {columnLabel}...</span>
							{:else if multiple}
								{selectedValues.length} selected
							{:else}
								{options.find((option) => option.value === selectedValues[0])?.label ?? selectedValues[0]}
							{/if}
						</span>
					</Button>
				{/snippet}
			</Popover.Trigger>
			<Popover.Content id={`${inputId}-listbox`} class="w-48 p-0" align="start">
				<Command.Root>
					<Command.Input aria-label={`Search ${columnLabel} options`} placeholder={`Search ${columnLabel}...`} />
					<Command.List>
						<Command.Empty>No options found.</Command.Empty>
						<Command.Group>
							{#each options as option (option.value)}
								{@const isSelected = selectedValues.includes(option.value)}
								<Command.Item
									value={option.value}
									onSelect={() => toggleOptionValue(filterId, multiple, option.value, currentFilter?.value)}
								>
									<span class="truncate">{option.label}</span>
									{#if option.count}
										<span class="text-muted-foreground font-mono text-xs">{option.count}</span>
									{/if}
									<Check class={cn("ml-auto size-4", isSelected ? "opacity-100" : "opacity-0")} aria-hidden="true" />
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Popover.Content>
		</Popover.Root>
	{:else if operator === "isEmpty" || operator === "isNotEmpty"}
		<div
			role="status"
			id={inputId}
			aria-live="polite"
			aria-label={`${columnLabel} filter is ${operator === "isEmpty" ? "empty" : "not empty"}`}
			class="h-8 w-full rounded-md border border-dashed"
		></div>
	{:else}
		<Input
			id={inputId}
			type="text"
			aria-label={`${columnLabel} filter value`}
			value={(currentFilter?.value ?? "") as string}
			placeholder={`Search ${columnLabel}...`}
			class="h-8"
			oninput={(event) => {
				onFilterUpdate(filterId, {
					value: event.currentTarget.value,
					operator,
				});
			}}
		/>
	{/if}
{/snippet}
