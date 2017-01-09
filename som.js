var kec = 5, ind = 12;
var w = new Array(kec), p = new Array(kec), d = new Array(kec);
var h, t, r, baris, iterasi;

// inisialisasi neuron bobot w, neuron input p, learning rate h, max iterasi t, radius r
function init(){
    for(var i = 0; i < kec; i++){
        w[i] = new Array(ind);
        d[i] = new Array(ind);
        for(var j = 0; j < ind; j++){
            w[i][j] = Math.random();
        }
    }

    p = [
        [0.546,	0.504, 0.512, 0.579, 0.638, 0.640, 0.583, 0.707, 0.790,	0.505, 0.548, 0.514],
        [0.279, 0.303, 0.289, 0.288, 0.239, 0.221, 0.250, 0.262, 0.208, 0.238, 0.281, 0.229],
        [0.465, 0.592, 0.528, 0.424, 0.437, 0.381, 0.294, 0.303, 0.215, 0.409, 0.465, 0.729],
        [0.880, 0.973, 0.846, 0.978, 0.742, 0.689, 0.698, 0.692, 0.560, 1.000, 0.883, 0.929],
        [1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 1.000, 0.942, 1.000, 1.000]
    ]

    h = 0.2;
    t = 200;
    r = 5;
    //console.log('initiated');
}

// menghitung euclidan distance p ke semua w
function euclid(){
    for(var a = baris; a <= baris; a++){
        var sum = 0;
        for(var b = 0; b < ind; b++){
            for(var i = 0; i < kec; i++){
                for(var j = 0; j < ind; j++){
                    sum = Math.pow(p[a][b] - w[i][j], 2);
                }
                sum += sum;
                d[i][b] = Math.sqrt(sum);
            }
        }
    }
    //console.log('euclid computed');
    return d;
}

var posisimin = [];
var winner = new Array(kec);

// mencari neuron winner dan menentukan neighboring neuron
function minimum(){
    var temp = euclid();
    var min = temp[0][0];    
    for(var i = 0; i < kec; i++){
        for(var j = 0; j < ind; j++){
            if(temp[i][j] < min){
                min = temp[i][j];
                posisimin = [i, j, min]; 
            }
        }
    }
    winner[baris] = posisimin;
    //console.log('winner found');
    return neighboring();
}

// update learning rate dan radius   
function update(){
    r = 5 * (1 - (iterasi / t));
    h = 0.2 * (1 - (iterasi / t));
    //console.log('learning rate & radius updated');
}

// update bobot winner dan neighboring
function neighboring(){
    var min_baris = posisimin[0], min_kolom = posisimin[1];
    var atas = Math.round(min_baris - r), bawah = Math.round(min_baris + r);
    var kiri = Math.round(min_kolom - r), kanan = Math.round(min_kolom + r);

    if(atas < 0){ atas = 0; }    
    if(bawah >= kec){ bawah = kec - 1; }
    if(kiri < 0){ kiri = 0; }
    if(kanan >= ind){ kanan = ind - 1; }
    //console.log('neighboring found');

    for(var i = atas; i <= bawah; i++){
        for(var j = kiri; j <= kanan; j++){
            w[i][j] = w[i][j] + h * (p[i][j] - w[i][j]);
        }
    }
    //console.log('weight updated');
    return w;
}

var color = ["#3c8dbc", "#dd4b39", "#00a65a", "#f39c12", "#001f3f"];
var label = [];

// menentukan koordinat dan pelabelan
function coordinate(){
    var b = 0, l = 0, r = 2;
    var baris, kolom, min_baris, max_baris, min_kolom, max_kolom;
    while(b < kec){
        baris = winner[b][0];
        kolom = winner[b][1];
        if(baris - r < 0){ min_baris = 0; }
        else{ min_baris = baris - r }
        if(baris + r > kec){ max_baris = kec; }
        else{ max_baris = baris + r }
        if(kolom - r < 0){ min_kolom = 0; }
        else{ min_kolom = kolom - r }
        if(kolom + r > ind){ max_kolom = ind; }
        else{ max_kolom = kolom + r }

        for(var i = min_baris; i <= max_baris; i++){
            for(var j = min_kolom; j <= max_kolom; j++){
                var k = 0;
                while(k < kec){
                    if(winner[k][0] == i && winner[k][1] == j){
                        label[k] = color[l];
                        k++;
                    }else{
                        k++;
                    }
                }
            }
        }
        b++;
        l++;
    }
    //console.log('coordinate found');
}

function colorMap(){
    coordinate();
    $('#laweyan').css({ fill: label[0] });
    $('#serengan').css({ fill: label[1] });
    $('#pskliwon').css({ fill: label[2] });
    $('#jebres').css({ fill: label[3] });
    $('#banjarsari').css({ fill: label[4] });
    //console.log('map colored');
}

$("#start").click(function(){
    init();
    iterasi = 0;
    while(iterasi < t){
        baris = 0;
        while(baris < kec){
            minimum();
            baris++;
        }
        iterasi++;            
        update();
    }
    colorMap();
}); 