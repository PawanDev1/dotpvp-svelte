<script lang="ts">
	interface Props {
		class?: string;
		isWhite?: boolean;
		large?: boolean;
	}

	let { class: className = '', isWhite = false, large = false }: Props = $props();

	const size = large ? 20 : 16;
	const color = isWhite ? '#fff' : 'currentColor';
</script>

<svg
	class={className}
	width={size}
	height={size}
	viewBox="0 0 16 16"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
>
	<circle cx="8" cy="8" r="7" stroke={color} stroke-width="1.5" fill="none" />
	<path d="M8 6V8M8 10H8.01" stroke={color} stroke-width="1.5" stroke-linecap="round" />
</svg>
