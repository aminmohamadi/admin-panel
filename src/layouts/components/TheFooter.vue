<template functional>
    <footer class="the-footer flex-wrap justify-between" :class="classes">
        <p>
          <span> کپی رایت &copy; </span>
          <span>{{ new Date().getFullYear() }} </span>
          <a href="https://instagram.com/amin_mohamadi_93" target="_blank" rel="nofollow">محمدامین محمدی گله زن</a>
          <span class="hidden sm:inline-block">, نمامی حقوق محفوظ می باشد</span>
        </p>

    </footer>
</template>

<script>
export default {
  name: 'the-footer',
  props: {
    classes: {
      type: String
    }
  },
}
</script>
