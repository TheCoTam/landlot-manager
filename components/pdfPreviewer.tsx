import WebView from "react-native-webview";

const PdfPreviewer = ({
  base64,
  fileUri,
}: {
  base64: string;
  fileUri: string;
}) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
        <style>
          html {
            height: 100%;
          }

          body {
            padding: 2;
            height: 100%;
            overflow: auto;
            display: flex;
            justify-content: center;
            background: #f9fafb;
          }

          #pdf-container {
            width: 100%;
            height: 100%;
            background: #f9fafb;
          }

          canvas {
            width: 100%;
            box-shadow: 0 0 2px rgba(0,0,0,0.2);
            background: #f9fafb;
          }
            

        </style>
      </head>
      <body id="tmp">
        <div id="pdf-container">
          <canvas id="pdf-canvas"></canvas>
        </div>

        <script>
          const base64 = "${base64}";
          const pdfData = atob(base64);

          const loadingTask = pdfjsLib.getDocument({ data: pdfData });
          loadingTask.promise.then(pdf => {
            pdf.getPage(1).then(page => {
              const viewport = page.getViewport({ scale: 1.0 }); // scale = độ phóng to
              const canvas = document.getElementById('pdf-canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              page.render({ canvasContext: context, viewport });
            });
          }).catch(err => {
            document.body.innerHTML = '<p style="color:red">Lỗi khi đọc PDF: ' + err + '</p>';
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={{ flex: 1 }}
      allowFileAccess
      allowUniversalAccessFromFileURLs
    />
  );
};

export default PdfPreviewer;
