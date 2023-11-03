<script lang="ts">
  import { onDestroy, onMount } from "svelte";

  onMount(() => {
    console.log("Mounted POST page");
  });
  onDestroy(() => {
    console.log("Destroying POST page");
  });
</script>

<h1>Posts</h1>
