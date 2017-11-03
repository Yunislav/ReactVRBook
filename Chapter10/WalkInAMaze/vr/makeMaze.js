

function duom() {
    
        var height = parseInt(document.getElementById("height").value);
        var width = parseInt(document.getElementById("width").value);
        var seed = parseInt(document.getElementById("seed").value);
    
        document.getElementById('out').innerHTML = display(maze(height,width,seed));
    }
    
function maze(x, y, seed) {

    var n = x * y - 1;
    console.log("Seed is:" + seed);

    var rng = new MersenneTwister(seed);

    if (n < 0) { alert("illegal maze dimensions"); return; }
        var horiz=[]; for (var j= 0; j<x+1; j++) horiz[j]= [];
        var verti = []; for (var j = 0; j < y + 1; j++) verti[j] = [];
        var here = [Math.floor(rng.random() * x), Math.floor(rng.random() * y)];
        console.log("Here: " + here);

        var path= [here];
        var unvisited = [];
        console.log("Calculating unvisited from 0.." + (x + 2));
        for (var j= 0; j<x+2; j++) {
            unvisited[j]= [];
            for (var k = 0; k < y + 1; k++) {
                unvisited[j].push(j > 0 && j < x + 1 && k > 0 && (j != here[0] + 1 || k != here[1] + 1));
                console.log("Calculating unvisted at [" + j + "]=" + unvisited[j]);
            }
        }
        while (0<n) {
            var potential = [
                [here[0] + 1, here[1]],
                [here[0], here[1] + 1],
                [here[0] - 1, here[1]],
                [here[0], here[1] - 1]];
            var neighbors= [];
            for (var j = 0; j < 4; j++)
                if (unvisited[potential[j][0] + 1][potential[j][1] + 1]) {
                    console.log("Calculating neighbor potential at [" + j+"]="+ potential[j]);
                    neighbors.push(potential[j]);
                }
            if (neighbors.length) {
                n= n-1;
                var randresult = rng.random();
                console.log("Calculationg next from random() of " + randresult + ", Neighbors length of" + neighbors.length);
                next = neighbors[Math.floor(randresult * neighbors.length)];
                console.log("next: " + next);

                unvisited[next[0]+1][next[1]+1]= false;
                if (next[0] == here[0])
                    horiz[next[0]][(next[1]+here[1]-1)/2]= true;
                else 
                    verti[(next[0]+here[0]-1)/2][next[1]]= true;
                path.push(here= next);
            } else 
                here= path.pop();
        }
        return ({x: x, y: y, horiz: horiz, verti: verti});
    }
    
    function display(m) {
        var text = [];
        for (var j = 0; j < m.x * 2 + 1; j++) {
            var line = [];
            if (0 == j % 2)
                for (var k = 0; k < m.y * 2 + 1; k++)
                    if (0 == k % 2)
                        line[k] = 'c';
                    else
                        if (j > 0 && m.verti[j / 2 - 1][Math.floor(k / 2)])
                            line[k] = ' ';
                        else
                            line[k] = 'w';
            else
                for (var k = 0; k < m.y * 2 + 1; k++)
                    if (0 == k % 2)
                        if (k > 0 && m.horiz[(j - 1) / 2][k / 2 - 1])
                            line[k] = ' ';
                        else
                            line[k] = 'x';
                    else
                        line[k] = ' ';
            //if (0 == j) line[1] = line[3] = ' ', line[2] = '1';
            if (0 == j) line[1] = '1';
            if (m.x * 2 - 1 == j) line[2 * m.y] = '2';
            text.push(line.join('') + '\r\n');
        }
        return text.join('');
    }
//jdg: Not using React here, this is pretty much the source as I found in 2-3 online version of hte maze program
//trying to modify it as little as possible.

//https://gist.github.com/banksean/300494 for the twister pseudo-random number generator, 
//included below. The NPM package is at:
// https://www.npmjs.com/package/mersenne-twister

    /*
      https://github.com/banksean wrapped Makoto Matsumoto and Takuji Nishimura's code in a namespace
      so it's better encapsulated. Now you can have multiple random number generators
      and they won't stomp all over eachother's state.
    
      If you want to use this as a substitute for Math.random(), use the random()
      method like so:
    
      var m = new MersenneTwister();
      var randomNumber = m.random();
    
      You can also call the other genrand_{foo}() methods on the instance.
    
      If you want to use a specific seed in order to get a repeatable random
      sequence, pass an integer into the constructor:
    
      var m = new MersenneTwister(123);
    
      and that will always produce the same random sequence.
    
      Sean McCullough (banksean@gmail.com)
    */

    /*
       A C-program for MT19937, with initialization improved 2002/1/26.
       Coded by Takuji Nishimura and Makoto Matsumoto.
    
       Before using, initialize the state by using init_seed(seed)
       or init_by_array(init_key, key_length).
    
       Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
       All rights reserved.
    
       Redistribution and use in source and binary forms, with or without
       modification, are permitted provided that the following conditions
       are met:
    
         1. Redistributions of source code must retain the above copyright
            notice, this list of conditions and the following disclaimer.
    
         2. Redistributions in binary form must reproduce the above copyright
            notice, this list of conditions and the following disclaimer in the
            documentation and/or other materials provided with the distribution.
    
         3. The names of its contributors may not be used to endorse or promote
            products derived from this software without specific prior written
            permission.
    
       THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
       "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
       LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
       A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
       CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
       EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
       PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
       PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
       LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
       NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
       SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
    
    
       Any feedback is very welcome.
       http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
       email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
    */

    var MersenneTwister = function (seed) {
        if (seed == undefined) {
            seed = new Date().getTime();
        }

        /* Period parameters */
        this.N = 624;
        this.M = 397;
        this.MATRIX_A = 0x9908b0df;   /* constant vector a */
        this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
        this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

        this.mt = new Array(this.N); /* the array for the state vector */
        this.mti = this.N + 1; /* mti==N+1 means mt[N] is not initialized */

        if (seed.constructor == Array) {
            this.init_by_array(seed, seed.length);
        }
        else {
            this.init_seed(seed);
        }
    }

    /* initializes mt[N] with a seed */
    /* origin name init_genrand */
    MersenneTwister.prototype.init_seed = function (s) {
        this.mt[0] = s >>> 0;
        for (this.mti = 1; this.mti < this.N; this.mti++) {
            var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
            this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
                + this.mti;
            /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
            /* In the previous versions, MSBs of the seed affect   */
            /* only MSBs of the array mt[].                        */
            /* 2002/01/09 modified by Makoto Matsumoto             */
            this.mt[this.mti] >>>= 0;
            /* for >32 bit machines */
        }
    }

    /* initialize by an array with array-length */
    /* init_key is the array for initializing keys */
    /* key_length is its length */
    /* slight change for C++, 2004/2/26 */
    MersenneTwister.prototype.init_by_array = function (init_key, key_length) {
        var i, j, k;
        this.init_seed(19650218);
        i = 1; j = 0;
        k = (this.N > key_length ? this.N : key_length);
        for (; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
                + init_key[j] + j; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++; j++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
            if (j >= key_length) j = 0;
        }
        for (k = this.N - 1; k; k--) {
            var s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
                - i; /* non linear */
            this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
            i++;
            if (i >= this.N) { this.mt[0] = this.mt[this.N - 1]; i = 1; }
        }

        this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
    }

    /* generates a random number on [0,0xffffffff]-interval */
    /* origin name genrand_int32 */
    MersenneTwister.prototype.random_int = function () {
        var y;
        var mag01 = new Array(0x0, this.MATRIX_A);
        /* mag01[x] = x * MATRIX_A  for x=0,1 */

        if (this.mti >= this.N) { /* generate N words at one time */
            var kk;

            if (this.mti == this.N + 1)  /* if init_seed() has not been called, */
                this.init_seed(5489);  /* a default initial seed is used */

            for (kk = 0; kk < this.N - this.M; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            for (; kk < this.N - 1; kk++) {
                y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
                this.mt[kk] = this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
            }
            y = (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
            this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

            this.mti = 0;
        }

        y = this.mt[this.mti++];

        /* Tempering */
        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        return y >>> 0;
    }

    /* generates a random number on [0,0x7fffffff]-interval */
    /* origin name genrand_int31 */
    MersenneTwister.prototype.random_int31 = function () {
        return (this.random_int() >>> 1);
    }

    /* generates a random number on [0,1]-real-interval */
    /* origin name genrand_real1 */
    MersenneTwister.prototype.random_incl = function () {
        return this.random_int() * (1.0 / 4294967295.0);
        /* divided by 2^32-1 */
    }

    /* generates a random number on [0,1)-real-interval */
    MersenneTwister.prototype.random = function () {
        return this.random_int() * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    /* generates a random number on (0,1)-real-interval */
    /* origin name genrand_real3 */
    MersenneTwister.prototype.random_excl = function () {
        return (this.random_int() + 0.5) * (1.0 / 4294967296.0);
        /* divided by 2^32 */
    }

    /* generates a random number on [0,1) with 53-bit resolution*/
    /* origin name genrand_res53 */
    MersenneTwister.prototype.random_long = function () {
        var a = this.random_int() >>> 5, b = this.random_int() >>> 6;
        return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
    }

    /* These real versions are due to Isaku Wada, 2002/01/09 added */

