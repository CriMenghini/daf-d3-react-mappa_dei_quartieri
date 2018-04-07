# Plot per analisi descrittiva della popolazione del quartiere

### Contenuto della cartella

* `pop-script.js`: il codice per la produzione del plot.
* `population-d3.html`: html dove è fatto l'embedding del plot.
* `style-pop.css`: css per formattare html.

### Visualizzare

Per il momento, per visualizzare il plot:

1. Clonare la cartella.
2. Aprire il file `population-d3.html` nel browser locale.


### Popolare il plot con dati reali

Per visualizzare dati reali è necessario che questi vengano espressi secondo la seguente  struttura dati:

		[{group: '0-9', male: 10, female: 12},
		{group: '10-19', male: 14, female: 15},
		{group: '20-29', male: 15, female: 18},
		{group: '30-39', male: 18, female: 18},
		....,	
		{group: '100-109', male: 1, female: 1},]

I dati per questo plot sono scaricabili da ISTAT e fanno riferimento al [censimento 2011](http://www.istat.it/storage/cartografia/variabili-censuarie/dati-cpa_2011.zip). Le colonne del dataset utili per questo plot sono quelle che vanno da `P14` a `P29` (popolazione residente totale __[M+F]__) e da `P30` a `P45` (popolazione residente maschile __[M]__). Per ottenere la popolazione residente femminile si può fare la differenza tra le due. A seguire il plot implementato, utilizzando dei dati finti. 
“Il seguente grafico rappresenta la distribuzione della popolazione per fasce d'età. In particolare, sull'asse delle Y sono definite le fasce d'età. Mentre sull'asse delle X è rappresentata la percentuale sul totale della popolazione residente. L'utente, inoltre, ha la possibilità di esplorare i dati passando il mouse sulle barre. Quindi, appare un tooltip che indica la percentuale di uomini o donne che appartengono a quella fascia di età.”
