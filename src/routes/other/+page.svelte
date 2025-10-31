<script lang="ts">
	import { Accordion, Button, Card, NavigationMenu } from "$lib";
	import { Calendar } from "$lib/calendar";
	import { Carousel } from "$lib/carousel";
	import { CalendarDate, getLocalTimeZone } from "@internationalized/date";

	let value = $state<CalendarDate | undefined>(new CalendarDate(2025, 6, 12));
	let selectedTime = $state<string | null>("10:00");

	const bookedDates = Array.from({ length: 3 }, (_, i) => new CalendarDate(2025, 6, 17 + i));
	const timeSlots = Array.from({ length: 37 }, (_, i) => {
		const totalMinutes = i * 15;
		const hour = Math.floor(totalMinutes / 60) + 9;
		const minute = totalMinutes % 60;
		return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
	});
</script>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Accordion</Card.Title>
	</Card.Header>
	<Card.Content>
		<Accordion.Root type="single">
			<Accordion.Item value="item-1">
				<Accordion.Trigger>Item 1</Accordion.Trigger>
				<Accordion.Content>Item Content</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="item-2">
				<Accordion.Trigger>Item 2</Accordion.Trigger>
				<Accordion.Content>Item Content yeah</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Calendar</Card.Title>
	</Card.Header>
	<Card.Content class="w-fit">
		<Calendar type="single" bind:value class="rounded-md" />
	</Card.Content>
</Card.Root>

<Card.Root class="m-5 gap-0 p-0">
	<Card.Content class="relative p-0 md:pr-48">
		<div class="p-6">
			<Calendar
				type="single"
				bind:value
				isDateUnavailable={(date) => bookedDates.some((d) => d.compare(date) === 0)}
				class="bg-transparent p-0 [--cell-size:--spacing(10)] data-unavailable:line-through data-unavailable:opacity-100 md:[--cell-size:--spacing(12)] [&_[data-outside-month]]:hidden"
				weekdayFormat="short"
			/>
		</div>
		<div
			class="no-scrollbar inset-y-0 right-0 flex max-h-72 w-full scroll-pb-6 flex-col gap-4 overflow-y-auto border-t p-6 md:absolute md:max-h-none md:w-48 md:border-t-0 md:border-l"
		>
			<div class="grid gap-2">
				{#each timeSlots as time (time)}
					<Button
						variant={selectedTime === time ? "default" : "outline"}
						onclick={() => (selectedTime = time)}
						class="w-full shadow-none"
					>
						{time}
					</Button>
				{/each}
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-col gap-4 border-t px-6 !py-5 md:flex-row">
		<div class="text-sm">
			{#if value && selectedTime}
				Your meeting is booked for
				<span class="font-medium">
					{value.toDate(getLocalTimeZone()).toLocaleDateString("en-US", {
						weekday: "long",
						day: "numeric",
						month: "short",
					})}
				</span>
				at <span class="font-medium">{selectedTime}</span>.
			{:else}
				Select a date and time for your meeting.
			{/if}
		</div>
		<Button disabled={!value || !selectedTime} class="w-full md:ml-auto md:w-auto" variant="outline">Continue</Button>
	</Card.Footer>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Carousel</Card.Title>
	</Card.Header>
	<Card.Content class="ml-8 w-fit">
		<Carousel.Root class="w-full max-w-xs">
			<Carousel.Content>
				{#each Array(5), i}
					<Carousel.Item>
						<div class="p-1">
							<Card.Root>
								<Card.Content class="flex aspect-square items-center justify-center p-6">
									<span class="text-4xl font-semibold">{i + 1}</span>
								</Card.Content>
							</Card.Root>
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	</Card.Content>
</Card.Root>

<Card.Root class="m-5">
	<Card.Header>
		<Card.Title>Navigation Menu</Card.Title>
	</Card.Header>
	<Card.Content class="ml-8 w-fit">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Item One</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[300px] gap-4 p-2">
							<li>
								<NavigationMenu.Link>Link</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link>Other Link</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
				<NavigationMenu.Item>
					<NavigationMenu.Trigger>Item Two</NavigationMenu.Trigger>
					<NavigationMenu.Content>
						<ul class="grid w-[300px] gap-4 p-2">
							<li>
								<NavigationMenu.Link>Link 1</NavigationMenu.Link>
							</li>
							<li>
								<NavigationMenu.Link>Link 2</NavigationMenu.Link>
							</li>
						</ul>
					</NavigationMenu.Content>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</Card.Content>
</Card.Root>
