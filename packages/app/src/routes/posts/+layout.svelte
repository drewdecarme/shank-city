<script lang="ts">
</script>

<p>
  You can <a href="/posts/create">+create</a>a new post or you can edit one by
  clicking on the below
</p>
<div class="posts">
  <aside>
    <h4>posts</h4>
    <nav>
      <ul>
        <li>
          <a href="/posts/one">One</a>
        </li>
        <li>
          <a href="/posts/two">Two</a>
        </li>
      </ul>
    </nav>
  </aside>
  <main>
    <slot />
  </main>
</div>

<style>
  .posts {
    display: grid;
    grid-template-columns: 200px 60ch;
    gap: 2rem;
  }
</style>
