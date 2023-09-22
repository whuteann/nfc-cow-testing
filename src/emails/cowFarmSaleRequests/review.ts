interface reviewProps {
  farm:  string,
  quantity:  string | number,
  cows: Array<Object>,
}

export const review = (data: reviewProps) => {

  let requestData: any = [];
  data.cows.forEach((value: any) => {
    requestData.push(
      `
      <hr>
      <p style="margin-top: 2em; margin-bottom: 2em;"> 
        Cow Secondary ID: ${value?.secondaryId} 
      </p>
      <p style="margin-top: 2em; margin-bottom: 2em;"> 
        Cow NFC ID: ${value?.nfcId} 
      </p>
      <p style="margin-top: 2em; margin-bottom: 2em;"> 
      Cow Farm: ${value?.farm?.name} 
      </p>
      `
    )
  })
  const logo = `${process.env.NEXT_PUBLIC_PUBLIC_URL}/static/images/logo/icare-logo.png`;

  return (`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
    
        <style>
          body {
            margin: 0px;
            padding: 3em;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            font-family: 'Nunito', sans-serif;
          }
    
          p {
            margin: 0px;
            padding: 0px;
          }
    
          /* Table Styling */
          table {
            border-collapse: collapse;
          }
    
          tr{
            border-bottom: 1px solid gray;
          }
    
          th, td {
            text-align: center;
            padding: 1em;
          }
    
          th {
            background-color: #006E34;
            color: white;
          }
    
          /* Other styling */
          .details-list p {
            padding-bottom: 0.1em;
          }
    
          .cta-button {
            background-color: #FFC052; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            padding: 10px 40px; 
            font-weight: bold;
            font-family: 'Nunito', sans-serif;
            font-size: 0.9rem;
            text-decoration: none;
          }
    
          .green-line {
            height: 3px; 
            width: 100%; 
            background-color: #006E34;
            margin: 2em 0em;
          }
    
          .email-title {
            font-weight: bold; 
            font-size: 2.2em;
          }
    
          .copyright-text {
            color: gray; 
            font-size: 0.9em;
          }
        </style>
      </head>
    
      <body>
        <div>
          <img src="${logo}" style="height: 6rem; margin-bottom: 1.5em;" />

          <p class="email-title">Cow Farm Sale Request</p>

          <div class="green-line"></div>
            <p style="font-size: 1.2em; font-weight: bold;">Sale Details</p>
            
            <p style="margin-top: 2em; margin-bottom: 2em;">
              Farm Name: ${data?.farm}
            </p>

            <p style="margin-top: 2em; margin-bottom: 2em;">
              Quantity: ${data?.quantity}
            </p>
            `+requestData.join('')+`

            <p class="copyright-text">&copy; Copyright ${new Date().getFullYear()}, iCareTrace</p>
        </div>
      </body>
    </html>
  `)
}