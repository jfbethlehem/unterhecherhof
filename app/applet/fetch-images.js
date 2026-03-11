async function fetchImages() {
  try {
    const res = await fetch('https://apt-unterhecherhof.hotels-in-tyrol.com/en/');
    const html = await res.text();
    const matches = html.match(/https:\/\/[^"']+\.(jpg|jpeg|png)/gi);
    if (matches) {
      const unique = [...new Set(matches)];
      console.log("HOTEL IMAGES:");
      console.log(unique.join('\n'));
    }
  } catch (e) {
    console.error(e);
  }
}

fetchImages();
