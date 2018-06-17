global.jQuery = require('jquery');
const $ = jQuery;
const flexibility = require('flexibility');
const Granim = require('granim');
const WebMidi = require('webmidi');
const screenfull = require('screenfull');

$(document).ready(() => {
	$.getJSON($('.data').data('url'), function(data) {
		// init Granim
		const granimInstance = new Granim({
			element: '#canvas-interactive',
			name: 'interactive-gradient',
			elToSetClassOn: '.canvas-interactive-wrapper',
			direction: 'diagonal',
			opacity: [1, 1],
			isPausedWhenNotInView: true,
			stateTransitionSpeed: 5000,
			states: data
		});

		// init WebMidi
		WebMidi.enable(function(err) {
			if (err) {
				console.log('WebMidi could not be enabled.', err);
			} else {
				let input = WebMidi.getInputByName(
					'Gestionnaire IAC Bus IAC 2'
				);
				console.log(input);
				// receive midi
				input.addListener('noteon', 'all', function(e) {
					let note = e.note.name + e.note.octave;

					// change gradient
					$.getJSON($('.data').data('midi'), function(data) {
						let obj = data.filter(function(midi) {
							return midi.midi == note;
						});
						if (obj.length !== 0) {
							let name = Object.values(obj[0])[0];
							granimInstance.changeState(name);
						}
					});
				});
			}
		});
	});

	// fullscreen
	$('.live__zone').click(function() {
		if (screenfull.enabled) {
			screenfull.request();
		}
	});
});
