var midi = null;  // global MIDIAccess object

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
  
  var inputs=midiAccess.inputs.values();
  for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = MIDIMessageEventHandler;
    haveAtLeastOneDevice = true;
  }
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess( { sysex: true } ).then( onMIDISuccess, onMIDIFailure );

function listInputsAndOutputs( midiAccess ) {
  for (var input in midiAccess.inputs) {
    console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'" );
  }

  for (var output in midiAccess.outputs) {
    console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'" );
  }
}

function onMIDIMessage( event ) {
  var str = "MIDI message received at timestamp " + event.timestamp + "[" + event.data.length + " bytes]: ";
  for (var i=0; i<event.data.length; i++) {
    str += "0x" + event.data[i].toString(16) + " ";
  }
  console.log( str );
}

function startLoggingMIDIInput( midiAccess, indexOfPort ) {
  midiAccess.inputs.forEach( function(entry) {entry.value.onmidimessage = onMIDIMessage;});
}

function MIDIMessageEventHandler(event) {
	console.log("Event: " + event.data[0] + "/" + event.data[1]);
	if (event.data[0] == 176 && event.data[1] == 64)
	{
		var slider = document.getElementById('cross');
		slider.value = event.data[2] / 127 * 100;
		cf.change(slider);
	}

	// Lautstaerke Audio1
	if (event.data[0] == 176 && event.data[1] == 48)
	{
		var slider 		= document.getElementById('vol1');
		var span		= document.getElementById('vol1span');
		slider.value 	= event.data[2] / 127 * 100;
		musik.volume(slider, span);
	}

	// Lautstaerke Audio2
	if (event.data[0] == 176 && event.data[1] == 49)
	{
		var slider 		= document.getElementById('vol2');
		var span		= document.getElementById('vol2span');
		slider.value 	= event.data[2] / 127 * 100;
		musik2.volume(slider, span);
	}

	// Equalizer fuer die hoehen Audio1
	if ((event.data[0] == 176 && event.data[1] == 6))
	{
		var slider 		= document.getElementById('eq1h');
		var para		= document.getElementById('eq1hp');
		slider.value 	= event.data[2] / 127 * 200;
		slider.value 	= event.data[1] == 14 ? 100: slider.value;
		musik.changeGainHigh(slider, para);
	}

	// Equalizer fuer die mitten Audio1
	if ((event.data[0] == 176 && event.data[1] == 10))
	{
		var slider 		= document.getElementById('eq1m');
		var para		= document.getElementById('eq1mp');
		slider.value 	= event.data[2] / 127 * 200;
		slider.value 	= event.data[1] == 15 ? 100: slider.value;
		musik.changeGainMid(slider, para);
	}

	// Equalizer fuer die tiefen Audio1
	if ((event.data[0] == 176 && event.data[1] == 14))
	{
		var slider 		= document.getElementById('eq1l');
		var para		= document.getElementById('eq1lp');
		slider.value 	= event.data[2] / 127 * 200;
		slider.value 	= event.data[1] == 17 ? 100: slider.value;
		musik.changeGainLow(slider, para);
	}

	// Equalizer fuer die hoehen Audio2
	if ((event.data[0] == 176 && event.data[1] == 7))
	{
		var slider 		= document.getElementById('eq2h');
		var para		= document.getElementById('eq2hp');
		slider.value 	= event.data[2] / 127 * 200;
		slider.value 	= event.data[1] == 18 ? 100: slider.value;
		musik2.changeGainHigh(slider, para);
	}

	// Equalizer fuer die mitten Audio2
	if ((event.data[0] == 176 && event.data[1] == 11))
	{
		var slider 		= document.getElementById('eq2m');
		var para		= document.getElementById('eq2mp');
		slider.value 	= event.data[2] / 127 * 200;
		slider.value 	= event.data[1] == 19 ? 100: slider.value;
		musik2.changeGainMid(slider, para);
	}

	// Equalizer fuer die tiefen Audio1
	if ((event.data[0] == 176 && event.data[1] == 15))
	{
		var slider 		= document.getElementById('eq2l');
		var para		= document.getElementById('eq2lp');
		slider.value 	= event.data[2] / 127 * 200;
		slider.value 	= event.data[1] == 21 ? 100: slider.value;
		musik2.changeGainLow(slider, para);
	}

	// Musik1 play/pause
	if (event.data[0] == 144 && event.data[1] == 48 && event.data[2] == 127)
	{
		musik.playPauseTrigger(document.getElementById('play1'));
	}

	// Musik1 stop
	if (event.data[0] == 144 && event.data[1] == 19 && event.data[2] == 127)
	{
		musik.stop(document.getElementById('stop1'), document.getElementById('play1'));
	}

	// Musik2 play/pause
	if (event.data[0] == 144 && event.data[1] == 49 && event.data[2] == 127)
	{
		musik2.playPauseTrigger(document.getElementById('play2'));
	}

	// Musik2 stop
	if (event.data[0] == 144 && event.data[1] == 23 && event.data[2] == 127)
	{
		musik2.stop(document.getElementById('stop2'), document.getElementById('play2'));
	}
	
	// Musik1 loop
	if (event.data[0] == 144 && event.data[1] == 20 && event.data[2] == 127)
	{
		musik2.loop(document.getElementById('loop1'));
	}
	
	// Musik2 loop
	if (event.data[0] == 144 && event.data[1] == 24 && event.data[2] == 127)
	{
		musik2.loop(document.getElementById('loop2'));
	}

	// Tempo musik1
	if (event.data[0] == 176 && event.data[1] == 50)
	{
		var slider 		= document.getElementById('tempo1');
		var span		= document.getElementById('tmp1span');
		slider.value 	= event.data[2] / 127 * 100;
		musik.tempo(slider, span);
	}

	// Tempo musik2
	if (event.data[0] == 176 && event.data[1] == 51)
	{
		var slider 		= document.getElementById('tempo2');
		var span		= document.getElementById('tmp2span');
		slider.value 	= event.data[2] / 127 * 100;
		musik2.tempo(slider, span);
	}
}