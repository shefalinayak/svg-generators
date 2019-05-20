Vue.component('paper', {

  props: ['w','h','src','data'],

  template: `
    <div class="paper">
      <button @click="downloadSVG()">Download SVG</button>
      <canvas ref="canvas"></canvas>
    </div>
  `,

  data: function() {
    return {
      update: null,
      paperscope: null,
    }
  },

  methods: {
    // loadScript from https://stackoverflow.com/a/950146
    // loads the javscript code from a file
    loadScript: function (url, callback)
    {
      // Adding the script tag to the head
      var head = document.head;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
      // Then bind the event to the callback function.
      // There are several events for cross browser compatibility.
      script.onreadystatechange = callback;
      script.onload = callback;
      // Fire the loading
      head.appendChild(script);
    },

    loadSketch: function() {
      let canvas = this.$refs.canvas;

      canvas.width = this.w;
      canvas.height = this.h;

      canvas.style.width  = this.w + 'px';
      canvas.style.height = this.h + 'px';

      this.paperscope = new paper.PaperScope();
      this.paperscope.setup(canvas);
      this.update = paperSketch(this);
    },

    downloadSVG: function() {
      let svg = this.paperscope.project.exportSVG({
        bounds: 'content',
        asString: true,
      });

      // make clean filename (with datetime)
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      if (month < 10) month = '0' + month;
      let day = d.getDate();
      if (day < 10) day = '0' + day;
      let hr = d.getHours();
      let min = d.getMinutes();
      if (min < 10) min = '0' + min;
      let sec = d.getSeconds();
      if (sec < 10) sec = '0' + sec;
      let datetime = year + month + day + '-' + hr + min + sec;
      let name = this.data.name;
      if (!this.data.name) {
        name = 'paperjs';
      }
      let filename = name + '-' + datetime;
      //console.log(filename);

      // download link
      let svgBlob = new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
      let svgUrl = URL.createObjectURL(svgBlob);
      let downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  },

  // watch for changes to object https://stackoverflow.com/a/42134176
  watch: {
    data: {
       handler(val) {
         this.update();
       },
       deep: true
    }
  },

  mounted() {
    this.loadScript(this.src, this.loadSketch);
  }
})
