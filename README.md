A [d3.js](https://d3js.org) dashboard using React built with [Create React App](https://github.com/facebookincubator/create-react-app) visualizing statistical data from ISTAT (year 2011) (not yet actually, right now it uses random data) on the map of neighborhoods (NIL) in Milan, Italy.

# Use
`npm i` and `npm start` and you should see a dashboard at `localhost:3000`

# Input data
## Istat data [aggregated on "sezioni di censimento"](src/data/istat_2011_Milano.csv)
Data downloaded from ISTAT at this [link](http://www.istat.it/storage/cartografia/variabili-censuarie/dati-cpa_2011.zip), subfolder "Sezioni di censimento" (documentation available at documented [here](https://www.istat.it/it/files/2013/11/Descrizione-dati-Pubblicazione-2016.03.09.pdf) extracted with code:

    comune="Milano"

    cd dati-cpa_2011/Sezioni\ di\ Censimento/
    output=../istat_2011_${comune}.csv

    #Print header
    head -1 R01_indicatori_2011_sezioni.csv | awk 'BEGIN{FS=";"} BEGIN{OFS=";"}{print $6,$8,$13,$73,$138,$139,$140,$141}' >> ${output}

    #Print data
    for i in *; do echo "processing file "$i; cat ${i} | tail -n +2 | awk 'BEGIN{FS=";"} BEGIN{OFS=";"}{print $6,$8,$13,$73,$138,$139,$140,$141}' | grep ${comune} >> ${output}; done

Headers correspond to:
* P1: number of residents
* P61: number of employed people
* E17: number of residential buildings with one floor
* E18: number of residential buildings with 2 floors
* E19: number of residential buildings with 3 floors
* E20: number of residential buildings with 4 floors or more
* SEZ2001: identifier for "sezione di censimento"
* COMUNE
* AreaMQ: area of a NIL in square meters

## Geojson file of ["sezioni di censimento"](src/data/ds98_infogeo_sezioni_censimento_localizzazione_2011c.EPSG4326.geojson) and of ["quartieri"](NILZone.EPSG4326.geojson)

## [Mapping between "sezioni di censimento" and "quartieri"](src/data/tableNILSezioniDiCensimento2011_sorted_prefixed.csv)
The visualization is based on bigger units than "sezioni di censimento", i.e. on "quartieri", or neighborhoods.
The mappping between "sezioni di censimento" and "quartieri" has been done with a [script](src/data/getTableNILSezioniDiCensimento2011.html) (using the js library turf, i.e., through the intersection of centroids of "sezioni di censimemto" and "quartieri polygons") and with the bash command:

    join -a 1 -a 2 -e'-' -1 2 -2 1 -o '0,1.1,1.3,1.4,1.5,1.6,1.7,1.8,2.2' -t ";" istat_2011_Milano.csv tableNILSezioniDiCensimento2011_sorted_prefixed.csv

## [Indicators](src/results.js)
Two indicators have been computed:
* tipi di alloggio (tipiAlloggio)
* densità di occupati (densitaOccupati)

From the Istat data and from the area of "quartieri" in R:

    data.csv <- read.csv(file="data.csv", sep=";", header=TRUE)
    tableNILAreaMQ.csv <- read.csv(file="tableNILAreaMQ.csv"), sep=";", header=TRUE)
    data.csv[data.csv=="-"] <- 0
    NIL = tableNILAreaMQ.csv[,1]
    results = c();
    for (n in NIL) {
        nildata.csv = data.csv[which(data.csv[,9]==n), c(3,4,5,6,7,8)]
        	
        numOccupati = as.numeric(nildata.csv[,2])
        densitaOccupati = sum(numOccupati)/tableNILAreaMQ.csv[which(tableNILAreaMQ.csv[,1]==n),2]

        #sum(E17*1+E18*2+E19*3+E20*4)/sum(E17+E18+E19+E20)
        numAlloggi1Piano = as.numeric(nildata.csv[,3]
        numAlloggi2Piani = as.numeric(nildata.csv[,4])
        numAlloggi3Piani = as.numeric(nildata.csv[,5])
        numAlloggi4PianiOPiu = as.numeric(nildata.csv[,6])
        numTotAlloggi = sum(numAlloggi1Piano + numAlloggi2Piani + numAlloggi3Piani + numAlloggi4PianiOPiu)
        tipiAlloggio = sum(numAlloggi1Piano + numAlloggi2Piani * 2 + numAlloggi3Piani * 3 + numAlloggi4PianiOPiu * 4) / sum(numTotAlloggi)
        
        results = rbind(results, c(n, densitaOccupati, tipiAlloggio))
    }
    #Write results file
    write.table(results, "results.csv", row.names=FALSE, sep=";", quote=FALSE)
	




