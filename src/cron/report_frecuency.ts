/* eslint-disable @typescript-eslint/no-explicit-any */
import { CronCommand } from 'cron';
import { SendMail } from '../mail/sendMail';
import moment from 'moment';
import { InversionesModel } from '../models/inversion_model';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReportEmailSended } from '../models/report_email_sended';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export class ReportFrecuency {
  reportFrecuency = async (): Promise<
    CronCommand<null, false> | undefined | null
  > => {
    const emails = ['luisdejesus200122@gmail.com', 'ti.reyesn@gmail.com'];
    for (const item of emails) {
      const header = {
        columns: await createPDFHeader(
          `Informe de Gastos para usuario: ${item}`,
        ),
        columnGap: 10,
        margin: [0, 0, 0, 30],
      };
      const options = {
        to: item,
        email: item,
        name: 'Jesus',
        filename: 'Reporte.pdf',
      };
      const gastos = await InversionesModel().findAll();
      const totalInvested = await InversionesModel().sum('total');
      const dataTable = {
        margin: [30, 30, 30, 30],
        columnGap: 10,
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          fillColor: '#01595C',
          layout: {
            defaultBorder: false,
          },

          body: await createFacturaSection(gastos),
        },
      };
      const receipt = {
        margin: [30, 30, 30, 30],
        columnGap: 10,
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          fillColor: '#01595C',
          layout: {
            defaultBorder: false,
          },

          body: await createReceipt(totalInvested),
        },
      };
      const pdf: any = {
        content: [header, receipt, dataTable],
      };
      pdfMake.createPdf(pdf).getBuffer(async (data) => {
        const sendMail = new SendMail('report');

        await sendMail.send(options, 'Reporte de Gastos', data);
      });
    await ReportEmailSended().create({user_email: item});
    }

    return null;
    async function createPDFHeader(checkName: string) {
      // const result: any = await this.getImageBase64(logo);
      const currentDate = moment().format('DD-MM-YYYY');
      const header = [
        // {
        //   image: `data:image/jpeg;base64,${result}`,
        //   width: 68
        // },
        {
          width: '65%',
          margin: [15, 20, 0, 0],
          fontSize: 15,
          color: '#01595C',
          text: checkName,
        },
        {
          width: '10%',
          bold: true,
          color: '#657685',
          margin: [0, 20, 0, 0],
          text: 'Fecha:',
        },
        {
          width: '20%',
          color: '#657685',
          margin: [-5, 20, 0, 0],
          text: currentDate,
        },
      ];
      return header;
    }

    async function createFacturaSection(signos: any[]) {
      // const project: any = await this.getNameProject(checkData.project);
      const data: any = [];
      const border = [true, true, true, true];
      const borderTitle = ['#01595C', '#01595C', '#FFFFFF', '#01595C'];
      const borderText = ['#01595C', '#01595C', '#01595C', '#01595C'];
      signos.forEach((e) => {
        data.push([
          {
            colSpan: 2,
            text: '',
            fillColor: '#FFFFFF',
            color: '#FFFFFF',
            fontSize: 12,
            margin: [0, 15], // Agregar margen superior e inferior a la descripción
            opacity: 0,
            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], // Hacer transparentes los bordes izquierdo y derecho
          },
          {
            text: '',
            fillColor: '#FFFFFF',
            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'], // Hacer transparentes los bordes izquierdo y derecho
            margin: [0, 15], // Agregar margen superior e inferior a la descripción
            opacity: 0,
            // borderColor: 'rgba(0, 0, 0, 0)'
          },
        ]);
        data.push([
          {
            colSpan: 2,
            text: 'Gastos',
            fillColor: '#01595C',
            color: '#FFFFFF',
            fontSize: 12,
          },
          {
            text: '',
            fillColor: '#01595C',
          },
        ]);

        data.push([
          {
            text: 'Nombre:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: e?.nombre,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);

        data.push([
          {
            text: 'Total Gastado:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: `${e?.total.toLocaleString()} Lps`,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
        data.push([
          {
            text: 'Fecha de creacion:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: moment(e.fecha).format('DD/MM/YYYY'),
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ]);
      });

      return data;
    }
    async function createReceipt(data: number) {
      const border = [true, true, true, true];
      const borderTitle = ['#01595C', '#01595C', '#FFFFFF', '#01595C'];
      const borderText = ['#01595C', '#01595C', '#01595C', '#01595C'];
      const receipt = [
        [
          {
            colSpan: 2,
            text: 'Monto Total Gastado',
            fillColor: '#01595C',
            color: '#FFFFFF',
            fontSize: 12,
          },
          {
            text: '',
            fillColor: '#01595C',
          },
        ],
        [
          {
            text: 'Total:',
            color: '#657685',
            bold: true,
            border: border,
            borderColor: borderTitle,
          },
          {
            text: `${data.toLocaleString()} Lps`,
            color: '#657685',
            border: border,
            borderColor: borderText,
          },
        ],
      ];
      return receipt;
    }
  };
}
