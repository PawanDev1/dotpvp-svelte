<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = "" }: Props = $props();
</script>

<svg
	class={className}
	width="16"
	height="16"
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<path
		d="M8 0L9.63 3.36L13.36 4.29L9.63 5.22L8 8.58L6.37 5.22L2.64 4.29L6.37 3.36L8 0Z"
		fill="currentColor"
	/>
	<path
		d="M8 9.42L9.63 12.78L13.36 13.71L9.63 14.64L8 18L6.37 14.64L2.64 13.71L6.37 12.78L8 9.42Z"
		fill="currentColor"
	/>
</svg>

