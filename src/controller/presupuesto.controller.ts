/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { InversionesModel } from '../models/inversion_model';
import { SendMail } from '../mail/sendMail';
import moment from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export class Controller {
  crearReporte = async (req: Request, res: Response) => {
    try {
      const { body } = req;
    console.log(body)
    const header = {
      columns: await this.createPDFHeader(
        `Informe de Gastos para usuario: ${body.to}`,
      ),
      columnGap: 10,
      margin: [0, 0, 0, 30],
    };
    const options = {
      to: body.to,
      email: body.to,
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

        body: await this.createFacturaSection(gastos),
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

        body: await this.createReceipt(totalInvested),
      },
    };
    const pdf: any = {
      content: [header, receipt, dataTable],
    };
    pdfMake.createPdf(pdf).getBuffer(async (data) => {
      const sendMail = new SendMail('report');

      await sendMail.send(options, 'Reporte de Gastos', data);
    });

    res.json({
      ok: true,
      msg: 'Reporte Creado Exitosamente',
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: `Hable con administrador: ${error}`,
    });
    }
  };
  getPresupuestos = async (req: Request, res: Response) => {
    const gastos = await InversionesModel().findAll();

    res.json({
      ok: true,
      gastos,
    });
  };
  createPresupuesto = async (req: Request, res: Response) => {
    try {
      const { body } = req;
      const inversion = await InversionesModel().create(body);
      res.json({
        ok: true,
        inversion,
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        ok: false,
        msg: `Hable con el administrador: ${error.message}`,
      });
    }
  };
  async createPDFHeader(checkName: string) {
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
  async createFacturaSection(signos: any[]) {
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

  async createReceipt(data: number) {
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
}
