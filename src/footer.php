
<p id="username" class="hide"><?= posix_getpwuid(posix_geteuid())['name'] ?></p>
<p id="hostname" class="hide"><?= gethostname() ?></p>

<div id="output"></div>
<div id="overlay"></div>

<script>
    const overlay = new Overlay()
    const prompt = new Prompt()
    const history = new History()
    const shell = new Shell(prompt, history, overlay)
</script>
