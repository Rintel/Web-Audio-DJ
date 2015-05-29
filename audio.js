/**
 * Kontruktor für das Audio Object. Übergeben wird die url der Datei (audio.mp3 wenn
 * im selben Ordner z.B.). Das Objects das erstellt wurde kann dann die unteren Funktionen
 * aufrufen.
 * Beispiel: var musik = new AudioDatei("wknd.mp3");
 * musik.informations();
 * musik.playPauseTrigger();
 * etc.
 *
 * API auf http://webaudio.github.io/web-audio-api/
 */
function AudioDatei(url)
{
	try
	{
		this.audio = new Audio();
		this.audio.controls = true;
		this.audio.src = url;

		this.context = new AudioContext();
		this.analyzer = this.context.createAnalyser();
		this.processor = this.context.createScriptProcessor(256, 1, 1);
		this.source = this.context.createGain();

		this.input = this.context.createMediaElementSource(this.audio);
		this.input.connect(this.source);

		this.isPlaying = false;
	}
	catch(e)
	{
		alert("DJ is not supported for your Browser.");
	}
}

/**
 * Spielt die Audio ab / stoppt die Audio der mit dem Objekt erstellt wurde.
 * Wird von einem Button aufgerufen mit this (also sich selbst) als parameter.
 * Bsp: onclick="musik.play(this);"
 * Dadruch wird der Button automatisch umbenannt.
 */
AudioDatei.prototype.playPauseTrigger = function(btn)
{
	if(this.isPlaying)
	{
		btn.innerHTML = "►";
		this.audio.pause();
		this.isPlaying = false;
	}
	else
	{
		btn.innerHTML = "▮▮";
		this.audio.play();
		this.isPlaying = true;
	}
};

/**
 * Setzt die Audio Datei auf anfang und pausiert sie.
 */
AudioDatei.prototype.stop = function(stopbtn, playbtn)
{
	playbtn.innerHTML = "►";
	this.audio.currentTime = 0;
	this.audio.pause();
	this.isPlaying = false;
};

/**
 * Gibt true zurück wenn die Audio am spielen ist und false wenn nicht.
 */
AudioDatei.prototype.isPlaying = function()
{
	return this.isPlaying;
};

/**
 * Gibt die Zeit der Audiodatei im format current/duration zurück.
 */
AudioDatei.prototype.informations = function()
{
	var laenge = this.audio.currentTime.toFixed(2) + "/" + this.audio.duration.toFixed(2);
	return laenge;
};

/**
 * Setzt die Lautstärke der Audiodatei auf den Wert den übergebenen Sliders.
 * Die Funktion wird so aufgerufen im slider: onchange="musik2.volume(this);"
 */
AudioDatei.prototype.volume = function(slider, span)
{
	var value = slider.value / 100;
	this.audio.volume = value;
	span.innerHTML = slider.value + "%";
};

/**
 * Setzt die Audiodatei auf endlosschleife und ändert den angezeigten text im button.
 * Aufruf im button: onclick="musik2.loop(this)"
 */
AudioDatei.prototype.loop = function(button)
{
	if(this.audio.loop) {
		this.audio.loop = false;
		button.innerHTML = "⟲";
	} else {
		this.audio.loop = true;
		button.innerHTML = "⥀";
	}
};

/**
 * Ändert das Tempo der Audioatei zu der Value von einem Slider.
 * Der Slider wird als Object übergeben Bsp: onchange="musik.tempo(this);"
 * Die funktion teilt die Value durch 100 und passt die Audio an.
 */
AudioDatei.prototype.tempo = function(slider, span)
{
	var value = slider.value / 100;
	this.audio.playbackRate = value;
	span.innerHTML = value.toFixed(2)
};

/**
 * Das Bearbeiten der High, Mid, Low - Range in einem gain Objekt.
 * Wird dann am ende soweit connected das nen Signal reinkommt,
 * es bearbeitet wird, und wieder rauskommt.
 */
AudioDatei.prototype.equalizer = function(slider)
{
	this.gain = this.context.createGain();

	var gainDb                      = -40.0;
    var bandSplit                   = [360, 3600];

    var highBand                    = this.context.createBiquadFilter();
        highBand.type               = "lowshelf";
        highBand.frequency.value    = bandSplit[0];
        highBand.gain.value         = gainDb;

    var highInvert                  = this.context.createGain();
        highInvert.gain.value       = -1.0;

    var midBand                     = this.context.createGain();

    var lowBand                     = this.context.createBiquadFilter();
        lowBand.type                = "highshelf";
        lowBand.frequency.value     = bandSplit[1];
        lowBand.gain.value          = gainDb;

    var lowInvert                   = this.context.createGain();
        lowInvert.gain.value        = -1.0;

    this.gain.connect(lowBand);
    this.gain.connect(midBand);
    this.gain.connect(highBand);

    highBand.connect(highInvert);
    lowBand.connect(lowInvert);

    highInvert.connect(midBand);
    lowInvert.connect(midBand);

    this.low                        = this.context.createGain();
    this.mid                        = this.context.createGain();
    this.high                       = this.context.createGain();
    this.out                        = this.context.createGain();

    lowBand.connect(this.low);
    midBand.connect(this.mid);
    highBand.connect(this.high);

    this.low.connect(this.out);
    this.mid.connect(this.out);
    this.high.connect(this.out);
};

/**
 * Ändert den Equalizer für High anhand eines Sliders.
 * Beim Slider mit onchange="musik.changeGainHigh(this)"; verbinden.
 */
AudioDatei.prototype.changeGainHigh = function(slider, para)
{
	var value = String('000' + parseFloat(slider.value)).slice(-3);
	var db = 20 * Math.log10(value/100);
	db = db.toFixed(2);
	
	para.innerHTML = "<br><br>" + db + " db<br>" + value + " %";

	this.high.gain.value = value / 100;
};

/**
 * Ändert den Equalizer für Mid anhand eines Sliders.
 * Beim Slider mit onchange="musik.changeGainMid(this)"; verbinden.
 */
AudioDatei.prototype.changeGainMid = function(slider, para)
{
	var value = String('000' + parseFloat(slider.value)).slice(-3);
	var db = 20 * Math.log10(value/100);
	db = db.toFixed(2);
	
	para.innerHTML = "<br><br>" + db + " db<br>" + value + " %";

	this.mid.gain.value = value / 100;
};

/**
 * Ändert den Equalizer für Mid anhand eines Sliders.
 * Beim Slider mit onchange="musik.changeGainLow(this)"; verbinden.
 */
AudioDatei.prototype.changeGainLow = function(slider, para)
{
	var value = String('000' + parseFloat(slider.value)).slice(-3);
	var db = 20 * Math.log10(value/100);
	db = db.toFixed(2);
	
	para.innerHTML = "<br><br>" + db + " db<br>" + value + " %";

	this.low.gain.value = value / 100;
};

/**
 * Wird aufgerufen um das gnaze zu initialisieren.
 */
AudioDatei.prototype.init = function()
{
	this.equalizer();
	this.source.connect(this.gain);
	this.out.connect(this.analyzer);
	this.out.connect(this.context.destination);
	this.analyzer.connect(this.processor);
	this.processor.connect(this.context.destination);
};


/**
 * Objekt für den Crossfader, bekommt die beiden Musik Objekte damit er deren
 * Audioausgänge bearbeiten kann.
 */
function Crossfader(m1, m2)
{
	this.musik1 = m1;
	this.musik2 = m2;
}

/**
 * Ändert die Ausgangslautstärke der linke und rechten Audiodatein.
 * Wird an den Crossfaderslider gebindet mit onchange="crossfader.change(this)"
 */
Crossfader.prototype.change = function(slider)
{
	var value =	parseInt(slider.value) / parseInt(slider.max);
	var volLeft = Math.cos(value * 0.5 * Math.PI);
	var volRight = Math.cos((1.0 - value) * 0.5 * Math.PI);
	
	this.musik1.source.gain.value = volLeft;
	this.musik2.source.gain.value = volRight;
};
