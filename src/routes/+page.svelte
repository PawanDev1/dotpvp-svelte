<script lang="ts"> 
import Header from '$components/header.svelte'; 
import MainContainer from '$components/MainContainer.svelte';
import Footer from '$components/Footer.svelte';
</script>

<div class="bg-[url('https://quest-csv-images.s3.ca-central-1.amazonaws.com/dotpvp-dev/Images/background.png')] bg-cover bg-center flex items-center justify-center h-screen w-screen p-4">
    <MainContainer />
    <div class="absolute bottom-0 left-0 right-0">
        <Footer />
    </div>
</div>
