var canvas = document.getElementById('visualizer1'); 
var canvasCtx 	= canvas.getContext('2d');
canvas.width = 280;
canvas.height = 144;
var gradient 	= canvasCtx.createLinearGradient(0, 0, 0, 100);

gradient.addColorStop(0, "#ffffff");
//gradient.addColorStop(0.1, "#303A39");
//gradient.addColorStop(0.2, "#8B919A");
//gradient.addColorStop(0.3, "#C5E2ED");
//gradient.addColorStop(0.4, "#705C30");
//gradient.addColorStop(0.5, "#FF7E43");
//gradient.addColorStop(0.6, "#CE5A1F");
//gradient.addColorStop(0.7, "#000000");
gradient.addColorStop(1, "#ffffff");

musik.processor.onaudioprocess = function()
{
	if (musik.isPlaying || musik2.isPlaying)
	{
		var data1 = new Uint8Array(musik.analyzer.frequencyBinCount); 
		musik.analyzer.getByteFrequencyData(data1);
		canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
		canvasCtx.fillStyle = "#161618";
		
	  	for (var i = 0; i < (data1.length / 5); i++) // WENN WIR GRÖßERE WOLLEN HIER
		{
			var value = data1[i];
			var percent = value / 300;
			var height = canvas.height *  percent;
			var offset = canvas.height - height - 1;
			var barWidth = canvas.width / musik.analyzer.frequencyBinCount;
			canvasCtx.fillStyle = gradient;
	  		canvasCtx.fillRect(i * barWidth*5, offset, barWidth*5, height);
	  	}

	  	for (var i = 0; i < canvas.height; i+=3)
		{
			canvasCtx.fillStyle = "#161618";
	  		canvasCtx.fillRect(canvas.width/musik.analyzer.frequencyBinCount, i, canvas.width, 1);
	  	}
	}
}

var canvas2 = document.getElementById('visualizer2'); 
canvas2.width = 280;
canvas2.height = 144;
var canvasCtx2 	= canvas2.getContext('2d');
var gradient2 	= canvasCtx2.createLinearGradient(0, 0, 0, 100);

gradient2.addColorStop(0, "#ffffff");/*
gradient.addColorStop(0.1, "#303A39");
gradient.addColorStop(0.2, "#8B919A");
gradient.addColorStop(0.3, "#C5E2ED");
gradient.addColorStop(0.4, "#705C30");
gradient.addColorStop(0.5, "#FF7E43");
gradient.addColorStop(0.6, "#CE5A1F");
gradient.addColorStop(0.7, "#000000");
gradient.addColorStop(0.8, "#000000");*/
gradient2.addColorStop(1, "#ffffff");

musik2.processor.onaudioprocess = function()
{
	var data2 = new Uint8Array(musik2.analyzer.frequencyBinCount); 
	musik2.analyzer.getByteFrequencyData(data2);
	canvasCtx2.clearRect(0, 0, canvas2.width, canvas2.height);
	canvasCtx2.fillStyle = "#161618";
	
  	for (var i = 0; i < (data2.length / 5); i++) // WENN WIR GRÖßERE WOLLEN HIER
	{
		var value = data2[i];
		var percent = value / 300;
		var height = canvas2.height *  percent;
		var offset = canvas2.height - height - 1;
		var barWidth = canvas2.width / musik2.analyzer.frequencyBinCount;
		canvasCtx2.fillStyle = gradient2;
  		canvasCtx2.fillRect(i * barWidth*5, offset, barWidth*5, height);
  	}

  	for (var i = 0; i < canvas2.height; i+=3)
	{
		canvasCtx2.fillStyle = "#161618";
  		canvasCtx2.fillRect(canvas2.width/musik2.analyzer.frequencyBinCount, i, canvas2.width, 1);
  	}
}