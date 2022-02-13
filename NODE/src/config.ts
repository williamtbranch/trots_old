import * as json5 from 'json5';
import * as fs from 'fs';
import { systemPreferences } from 'electron';

export class Config {
  alphavantageKey: string;
  path: string;
  constructor(){
    this.alphavantageKey = "demo";
    this.path = process.env.HOME + "/.config/trots.conf";
  }
  save(){
    fs.writeFile(this.path, this.alphavantageKey, 'utf8', (err) => {
      if (err)
        console.error(err);
      // else {
      //   console.log("File written");
      // }
    }); 
  }
  load(callback: () => void){
    console.log("in open");

    fs.readFile(this.path, "utf8", (err,data) => {
      if (err){
        console.error(err); 
        return;
      }
      this.alphavantageKey = data;
      callback();
    })
  }
}