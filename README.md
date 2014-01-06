# jke-d3-ecg

This is an ECG chart component built on top of [D3.js](http://d3js.org) and it was built to be used as part of two presentations ([Rethink your frontend architecture](https://github.com/joakimkemeny/presentation.frontend) and
[Better and more fun applications with D3.js](https://github.com/joakimkemeny/presentation.d3)) and it should **NOT**
be considered production quality yet.

The chart displays an ECG curve based on a continous stream of values that should typically be provided over a WebSocket. You can find a live demo [here](http://joakimkemeny.github.io/jke.d3.ecg).

## Usage

To use this chart you first need to download it and all of its dependencies. The easiest way to do that is through [Bower](http://bower.io).

```
> bower install https://github.com/joakimkemeny/jke.d3.ecg.git --save
```

The second step is to include all dependencies in your HTML and initialize the chart.

```html
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<link rel="stylesheet" href="bower_components/jke-d3-ecg/dist/jke-d3-ecg.css">
</head>
<body>

	<!-- Placeholder for the chart -->
	<div class="jke-ecgChart"></div>

	<!-- Include dependencies -->
	<script src="bower_components/jquery/jquery.min.js"></script>
	<script src="bower_components/jquery-ui/ui/minified/jquery.ui.widget.min.js"></script>
	<script src="bower_components/d3/d3.min.js"></script>

	<!-- Include jke-d3-ecg and initialize the chart -->
	<script src="bower_components/jke-d3-ecg/dist/jke-d3-ecg.min.js"></script>
	<script>
		$('.jke-ecgChart').ecgChart({
			
			height: 600,
			width: 800
		
		});
	</script>

</body>
</html>
```

The last step is to add some data points to the chart. The x-value should be a timestamp in millisecond and the y-value should be the actual value to be shown.

```javascript
var _data = [
	0, 0, 0, 0, 0.0000050048828125, 0.0000137939453125, 0.000049560546875,
	0.00008740234375, 0.00015966796875, 0.000262451171875, 0.0003975830078125, 0.0005687255859375,
	0.0007802734375, 0.001037353515625, 0.0013468017578125, 0.00172119140625, 0.0021756591796875,
	0.0027232666015625, 0.0033880615234375, 0.004206787109375, 0.0052380371093750005,
	0.006586181640625, 0.008400146484375001, 0.010904296875, 0.0144892578125, 0.0196798095703125, 
	0.049684204101562504, 0.0886883544921875, 0.11185363769531251, 0.134164306640625,
	0.137352294921875, 0.1160369873046875, 0.08516308593750001, 0.0539765625, 
	0.014997436523437501, -0.015882568359375, -0.0387554931640625, -0.06125732421875,
	-0.0745780029296875, -0.07479357910156251, -0.0725338134765625, -0.0418538818359375,
	0.08582861328125001, 0.397717529296875, 0.8136408691406251, 1.2295617980957032,
	0.9944150390625001, 0.2824605712890625, -0.38949267578125, -0.597251220703125,
	-0.425675537109375, -0.1537947998046875, -0.0500914306640625, -0.0111041259765625,
	0.0027451171875, 0.0071739501953125, 0.008443359375, 0.0094327392578125, 0.012530517578125,
	0.0176046142578125, 0.0300162353515625, 0.0433489990234375, 0.056962646484375004,
	0.0704832763671875, 0.0770511474609375, 0.0898175048828125, 0.10311853027343751,
	0.117046142578125, 0.1312630615234375, 0.1529300537109375, 0.167607177734375,
	0.1899068603515625, 0.2124422607421875, 0.235044677734375, 0.2575535888671875,
	0.2724073486328125, 0.286978271484375, 0.3007579345703125, 0.3067425537109375,
	0.3106370849609375, 0.303756103515625, 0.2897236328125,0.25916931152343753,
	0.2200599365234375, 0.1728209228515625, 0.133416259765625, 0.086224853515625,
	0.05493408203125, 0.02409423828125, 0.00922607421875, -0.0043409423828125,
	-0.0097349853515625, -0.013127685546875, -0.01423095703125, -0.013834716796875,
	-0.012556030273437501, -0.010675048828125, -0.00835888671875, 
	-0.0057305908203125, -0.0000562744140625];
    
// Create a data point generator.
var getDataPoint = (function () {
	var _x = -1;
	var _max = _data.length;

	return function () {
		_x = (_x + 1) % _max;
		return { x: Date.now(), y: _data[_x] };
	};
})();

var heartRate = 60; // bpm
var interval = 60 * 1000 / (_data.length * heartRate);

// Generate a new data point based on the heart rate.
setInterval(function () {
	$('.jke-ecgChart').ecgChart('addDataPoint', getDataPoint());
}, interval);
```

You can call `addDataPoint` as many times as you want and the component will make sure that the value fits within the range of the chart.

## Customize

If you want to customize the appearance of the chart you can easily change all of the colors. If you use CSS or LESS you have to do this directly in the code but if you use Sass you can change all colors like this:

```scss
$jke-ecgChart-axisColor: #ddd;

$jke-ecgChart-backgroundColor: #fff;

$jke-ecgChart-xGridColor: #ddd;
$jke-ecgChart-yGridColor: #ddd;

$jke-ecgChart-lineColor: #f4771b;

@import "bower_components/jke-d3-ecg/src/scss/jke-d3-ecg";
```

## Known issues

* The curve is not prefectly timed. _This is probably a test data issue since `setInterval` is not that reliable._
* The curve should look much nicer and the old curve should fade out.
* All options are fixed and cannot be changed after initialization.

## Contact

If you have any questions or if you want the live version of any of the presentations that this component is a part of you can contact me on Twitter [@joakimkemeny](http://twitter.com/joakimkemeny).

## License

The source code for the presentation and the demos is licensed under the Apache License,
Version 2.0 (the "License"); you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

[http://www.apache.org/licenses/LICENSE-2.0]()

Unless required by applicable law or agreed to in writing, software distributed under the License
is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
implied. See the License for the specific language governing permissions and limitations under
the License.
