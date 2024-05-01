/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { InversionesModel } from "../models/inversion_model";
import { SendMail } from "../mail/sendMail";
import moment from "moment";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export class Controller {
  crearReporte = async (req: Request, res: Response) => {
    const { body } = req;
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
      name: "Jesus",
      filename: "Reporte.pdf",
    };
    const pdf: any = {
      content: [header],
    };
    pdfMake.createPdf(pdf).getBuffer(async (data) => {
      const sendMail = new SendMail("report");

      await sendMail.send(options, "Prueba Reporte", data);
    });

    res.json({
      ok: true,
      msg: "Reporte Creado Exitosamente",
    });
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
    const currentDate = moment().format("DD-MM-YYYY");
    const header = [
      // {
      //   image: `data:image/jpeg;base64,${result}`,
      //   width: 68
      // },
      {
        width: "65%",
        margin: [15, 20, 0, 0],
        fontSize: 15,
        color: "#01595C",
        text: checkName,
      },
      {
        width: "10%",
        bold: true,
        color: "#657685",
        margin: [0, 20, 0, 0],
        text: "Fecha:",
      },
      {
        width: "20%",
        color: "#657685",
        margin: [-5, 20, 0, 0],
        text: currentDate,
      },
    ];
    return header;
  }
}
