/**
 * to PDF
 * @authors Your Name (you@example.org)
 * @date    2019-11-20 16:12:37
 * @version $Id$
 */

import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (titleP) {
    	this.reportVisible = false;
      var title = this.reportTitle;
      html2Canvas(document.querySelector('#contentList'), {
        allowTaint: true
      }).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        console.log(contentWidth);
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        let w = 592.28/contentWidth * 10 
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', w, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            console.log(leftHeight);
            PDF.addImage(pageData, 'JPEG',w, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
    }
  }
}