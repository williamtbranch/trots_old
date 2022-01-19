module tr.trots_forth;

import std.stdio;
import std.format;


enum ByteCode {
        IPUSH,
        IADD,
        RTOKEN, //retrieve token
        PTOKEN, //print token
        HALT,
}

union TByte {
        int i = 0;
        float f;
        char c;
        TByte* p;
        ByteCode b;
}

class Entry{
        //flags
        bool valid = true;
        bool last = false;
        bool first = false;
        TByte[] data;
        int index;
        this(TByte[] in_data, int in_index){
                data = in_data;
                index = in_index;
                if (data[0].i == 0){
                        valid = false;
                }
        }
        void print(){
                int name_size = data[index].i;
                writeln(format("Name Size:   %s", name_size));
                printf("Name: ");
                
        }
}



class Dictionary{
        TByte[] data = new TByte[1_000_000];
        this(){
                this.buildDictionary();
        }

        //findes the last entry in the dictionary
        //returns 0 if there are none


        void printEntries(){
                Entry entry = new Entry(data, 1);
                entry.print();
        }
        void enterPrimitive(string name, ByteCode bytecode){
                /* 
                * dictionary data layout
                * |entry name length(5)|e|n|t|r|y|prev|this|next|
                * |hidden flag(0|1=true)|immediate flag(0|1=true)|primitive flag(0|1=true)|
                * |b|y|t|e|c|o|d|e|
                */

                bool is_first = false;
                //writeln(format("Size of %s: is %s ", name, name.length));
                int index = data[0].i; //gets first unused space
                writeln(format("first unused space is at: %s", index));
                int prev;
                int current;
                if (index == 1){
                        is_first = true;
                }
                //set prev
                if (is_first){
                        prev = 0;
                }
                current = index;

                data[index++].i = cast(int)name.length;
                foreach (char key; name)
                {
                       data[index++].c = key; 
                }
                data[index++].i = prev;
                data[index++].i = current;
                int next_index = index;
                data[index++].i = 0; // temporary
                data[index++].i = 0; //hidden
                data[index++].i = 1; //immediate
                data[index++].i = 1; //primitive
                data[index++].b = bytecode;
                data[next_index].i = index;
                data[0].i = index;
        }
        void buildDictionary(){
                data[0].i = 1;
                enterPrimitive("ipush", ByteCode.IPUSH);
                //enterPrimitive("iadd", ByteCode.IADD);
                //enterPrimitive("rtoken", ByteCode.RTOKEN);
                //enterPrimitive("ptoken", ByteCode.PTOKEN);
                //enterPrimitive("halt", ByteCode.HALT);
                printEntries();
                writeln(format("0 = %s", data[0].i));
                writeln(format("1 = %s", data[1].i));
                writeln(format("2 = %s", data[2].c));
                writeln(format("3 = %s", data[3].c));
                writeln(format("4 = %s", data[4].c));
                writeln(format("5 = %s", data[5].c));
                writeln(format("6 = %s", data[6].c));
        }

}

class Machine {
        bool machine_active = true;
        bool compile_mode = false;
        int ip = 0; //instruction pointer
        int sp = -1; //stack pointer
        string current_token;
        char[] input_buffer;

        TByte[] stack = new TByte[1000];
        TByte[] rstack = new TByte[1000];
        TByte[] code = new TByte[1000];
        Dictionary dictionary;
        this(){
                code[0].b = ByteCode.HALT;
                dictionary = new Dictionary();
        }

        void runMachine(){
                while(machine_active){
                        final switch (code[ip].b){
                                case ByteCode.HALT:
                                        machine_active = false;
                                        writeln(format("doing halt"));
                                        break;
                                case ByteCode.IPUSH:
                                        ip+=2;
                                        sp++;
                                        stack[sp]=code[ip-1];
                                        writeln(format("doing ipush"));
                                        break;
                                case ByteCode.RTOKEN:
                                        ip++;
                                        input_buffer = readln().dup;
                                        writeln(format("rtoken"));
                                        break;
                                case ByteCode.PTOKEN:
                                        ip++;
                                        writeln(input_buffer);
                                        writeln(input_buffer[1]);
                                        break;
                                case ByteCode.IADD:
                                        ip++;
                                        stack[sp-1].i = stack[sp-1].i + stack[sp].i;
                                        sp--;
                                        writeln(format("doing iadd"));
                                        break;
                        }
                }
                writeln(format("final number is %s", stack[0].i));
        }

        void mout() {
                writeln(format("number is %s", stack[0].i));
        }
}