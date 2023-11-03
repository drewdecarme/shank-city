<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  onMount(() => {
    console.log("Mounted HOME page");
  });
  onDestroy(() => {
    console.log("Destroying HOME page");
  });
</script>

<h1>Home</h1>
