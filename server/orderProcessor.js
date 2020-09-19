const path = require('path');
const csv = require("fast-csv");
const fs = require("fs");

class orderProcessor{

    constructor(filePath){
        this.filePath = path.normalize(filePath);
    }

    async processOrder(order) {
        await orderProcessor.appendAsync(this.filePath, [order]);
        console.log(order);
    }

    static writeAsync(filestream, rows, options) {
        return new Promise((res, rej) => {
          csv
            .writeToStream(filestream, rows, options)
            .on("error", (err) => rej(err))
            .on("finish", () => res());
        });
      }

    static async appendAsync(filePath, rows) {
        const fileAlreadyExist = fs.existsSync(filePath);
        await orderProcessor.writeAsync(
          fs.createWriteStream(filePath, { flags: "a" }),
          rows,
          {
            headers: true,
            includeEndRowDelimiter: true,
            writeHeaders: !fileAlreadyExist,
          }
        );
      }
}

module.exports = orderProcessor;
