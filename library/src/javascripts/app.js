global.jQuery = require('jquery');
const $ = jQuery;
const flexibility = require('flexibility');
const Granim = require('granim');
const WebMidi = require('webmidi');
const screenfull = require('screenfull');

$(document).ready(() => {
	if ($('.preview').length) {
		WebMidi.enable(function(err) {
			let input;
			for (let i = 0; i < WebMidi.inputs.length; i++) {
				console.log(WebMidi.inputs[i].name);
				input = '<div class="input">';
				input += WebMidi.inputs[i].name;
				input += '</div>';
				$('.midi').append(input);
			}
		});
		$.getJSON($('.data').data('url'), function(data) {
			let track;
			for (let i = 0; i < Object.keys(data).length; i++) {
				track = '<div class="track">';
				track +=
					'<h3 class="track__title">' +
					Object.keys(data)[i] +
					'</h3>';
				track +=
					'<div class="track__gradient" style="background: -webkit-linear-gradient(-45deg, ' +
					Object.values(data)[i].gradients[0][0] +
					' 0%,' +
					Object.values(data)[i].gradients[0][1] +
					' 100%);"></div>';
				track +=
					'<div class="track__gradient" style="background: -webkit-linear-gradient(-45deg, ' +
					Object.values(data)[i].gradients[2][0] +
					' 0%,' +
					Object.values(data)[i].gradients[2][1] +
					' 100%);"></div>';
				track += '</div>';
				$('.preview').append(track);
			}
		});
	} else {
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
						$('.data').data('input')
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
	}
});
