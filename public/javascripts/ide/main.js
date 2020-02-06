/*
Drag bar for resizing panels.
 */

function _clamp_widths_of_drag($left_panel, $right_panel, delta_drag, min_width=50) {
	let left_width = $left_panel.width() + delta_drag;
	let right_width = $right_panel.width() - delta_drag;
	let is_clamped = false;
	if (left_width < min_width) {
		right_width += left_width - min_width;
		left_width = min_width;
		is_clamped = true;
	} else if (right_width < min_width) {
		left_width += right_width - min_width;
		right_width = min_width;
		is_clamped = true;
	}
	return {left: left_width, right: right_width, is_clamped: is_clamped};
}

function initialize_drag_bar() {
	let is_dragging = false;
	let resize_fn;

	$('.vertical_drag_bar').each(function (index, element) {
		let $this = $(element);
		let $left_panel = $($this.data('left'));
		let $right_panel = $($this.data('right'));

		$this.on('mousedown', function (mousedown_event) {
			mousedown_event.preventDefault();
			is_dragging = true;
			let start_drag = mousedown_event.pageX;
			// Create state-dependent function for each drag bar
			resize_fn = function (mousemove_event) {
				let end_drag = mousemove_event.pageX;
				let delta_drag = end_drag - start_drag;
				let width = _clamp_widths_of_drag($left_panel, $right_panel, delta_drag);
				$left_panel.css({width: width.left + 'px'});
				$right_panel.css({width: width.right + 'px'});
				start_drag = end_drag;
				if (width.is_clamped)
					start_drag = $right_panel.position().left - 1;
				manage_sizes();
			};
		});
	});

	// Update panel size as drag bar is dragged
	$(document).on('mousemove', function (event) {
		if (is_dragging)
			resize_fn(event);
	});

	// Stop dragging when drag bar is released
	$(document).on('mouseup', function (event) {
		// Force mouseup event to continue
		event.preventDefault();
		if (is_dragging)
			is_dragging = false;
	});
}

/*
Supported themes
 */

let themes = ['ambiance', 'chaos', 'chrome', 'clouds', 'clouds_midnight', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'dreamweaver', 'eclipse', 'github', 'gob', 'gruvbox', 'idle_fingers', 'iplastic', 'jett', 'katzenmilch', 'kr_theme', 'kuroir', 'merbivore', 'merbivore_soft', 'mono_industrial', 'monokai', 'pastel_on_dark', 'solarized_dark', 'solarized_light', 'sqlserver', 'terminal', 'textmate', 'tomorrow', 'tomorrow_night', 'tomorrow_night_blue', 'tomorrow_night_bright', 'tomorrow_night_eighties', 'twilight', 'vibrant_ink', 'xcode'];
let theme_files = [];
for (let theme of themes)
	theme_files.push('theme-' + theme + '.js');

/*
Supported language modes
 */

let modes = ['abap', 'abc', 'actionscript', 'ada', 'apache_conf', 'apex', 'applescript', 'aql', 'asciidoc', 'asl', 'assembly_x86', 'autohotkey', 'batchfile', 'bro', 'c9search', 'c_cpp', 'cirru', 'clojure', 'cobol', 'coffee', 'coldfusion', 'crystal', 'csharp', 'csound_document', 'csound_orchestra', 'csound_score', 'csp', 'css', 'curly', 'd', 'dart', 'diff', 'django', 'dockerfile', 'dot', 'drools', 'edifact', 'eiffel', 'ejs', 'elixir', 'elm', 'erlang', 'forth', 'fortran', 'fsharp', 'fsl', 'ftl', 'gcode', 'gherkin', 'gitignore', 'glsl', 'gobstones', 'golang', 'graphqlschema', 'groovy', 'haml', 'handlebars', 'haskell', 'haskell_cabal', 'haxe', 'hjson', 'html', 'html_elixir', 'html_ruby', 'ini', 'io', 'jack', 'jade', 'java', 'javascript', 'json', 'json5', 'jsoniq', 'jsp', 'jssm', 'jsx', 'julia', 'kotlin', 'latex', 'less', 'liquid', 'lisp', 'livescript', 'logiql', 'logtalk', 'lsl', 'lua', 'luapage', 'lucene', 'makefile', 'markdown', 'mask', 'matlab', 'maze', 'mel', 'mixal', 'mushcode', 'mysql', 'nginx', 'nim', 'nix', 'nsis', 'nunjucks', 'objectivec', 'ocaml', 'pascal', 'perl', 'perl6', 'pgsql', 'php', 'php_laravel_blade', 'pig', 'plain_text', 'powershell', 'praat', 'prolog', 'properties', 'protobuf', 'puppet', 'python', 'r', 'razor', 'rdoc', 'red', 'redshift', 'rhtml', 'rst', 'ruby', 'rust', 'sass', 'scad', 'scala', 'scheme', 'scss', 'sh', 'sjs', 'slim', 'smarty', 'snippets', 'soy_template', 'space', 'sparql', 'sql', 'sqlserver', 'stylus', 'svg', 'swift', 'tcl', 'terraform', 'tex', 'text', 'textile', 'toml', 'tsx', 'turtle', 'twig', 'typescript', 'vala', 'vbscript', 'velocity', 'verilog', 'vhdl', 'visualforce', 'wollok', 'xml', 'xquery', 'yaml', 'zeek'];
let mode_files = [];
for (let mode of modes)
	mode_files.push('mode-' + mode + '.js');

/*
Component dimension handler
 */

function manage_sizes() {
	// Specify chat box height to prevent parent from stretching vertically
	$('.chat_box').css('height', $('#right_panel').height() + 'px');

	// Set chat message display height to fit both display and message input form inside chat box
	let components_height = $('.chat_input_form').height() + $('.group_chat_label').outerHeight();
	$('.chat_messages').css('height', $('#right_panel').height() - components_height + 'px');

	$('.editor_container').css('height', $('#center_panel').height() + 'px');
	ace.edit('editor1').resize();
	ace.edit('editor2').resize();

	$('.vertical_drag_bar').each(function (index, element) {
		let $this = $(element);
		let $left_panel = $($this.data('left'));
		let $right_panel = $($this.data('right'));
		let left_height = $left_panel.height();
		let right_height = $right_panel.height();
		let height = Math.min(left_height, right_height);
		$this.css('height', height + 'px');
	});
}

/*
Time passed element update to be run on schedule
 */

function seconds_to_hms(seconds) {
	let s = parseInt(seconds);
	let h_val = Math.floor(s / 3600);
	let m_val = Math.floor(s % 3600 / 60);
	let s_val = Math.floor(s % 3600 % 60);
	return {
		h: h_val > 0 ? h_val + (h_val === 1 ? " hour" : " hours") : "",
		m: m_val > 0 ? m_val + (m_val === 1 ? " minute" : " minutes") : "",
		s: s_val > 0 ? s_val + (s_val === 1 ? " second" : " seconds") : "",
	};
}

function update_passed_time() {
	let now = (new Date()).getTime();
	$('.time_passed').each(function () {
		let $this = $(this);
		let past = $this.data('timestamp');
		let delta = (now - past) / 1000;
		let hms = seconds_to_hms(delta);
		let t_units = 'Less than a minute';
		if (hms.h.length > 0)
			t_units = hms.h;
		else if (hms.m.length > 0)
			t_units = hms.m;
		$this.text(t_units + ' ago');
	});
}

function get_text1() {
	return 'Proposal:\n' +
		'\t"An IDE to write, collaborate, and execute code from any device with an internet connection."\n' +
		'\tHereafter referred to as Lumos IDE.\n' +
		'\n' +
		'In short, Lumos IDE is similar to:\n' +
		'\tGoogle Docs:\n' +
		'\t\tBut aimed at writing code.\n' +
		'\tSubEthaEdit:\n' +
		'\t\tBut OS-independent and requires zero software installation.\n' +
		'\tCodeshare:\n' +
		'\t\tBut more than a text-editor.\n' +
		'\t\tBut allows access to a server\'s shell and direct editing of its files.\n' +
		'\tAWS Cloud9:\n' +
		'\t\tBut with a hassle-free setup.\n' +
		'\t\tBut with minimal, easy-to-use interface and features.\n' +
		'\t\tBut with niche features targeting code sharing in an education/hobby setting.\n' +
		'\tOthers:\n' +
		'\t\thttps://codenvy.com/\n' +
		'\t\thttps://www.eclipse.org/che/\n' +
		'\n' +
		'Implementation of Lumos IDE:\n' +
		'\tCollaboration:\n' +
		'\t\tConcurrently edit files with multiple other users.\n' +
		'\t\tCommunicate with other users over text, voice, and video.\n' +
		'\t\tDifferential synchronization concept and pseudo-code\n' +
		'\t\t\thttps://static.googleusercontent.com/media/research.google.com/en//pubs/archive/35605.pdf\n' +
		'\t\tGoogle library for diff and patching documents\n' +
		'\t\t\thttps://github.com/google/diff-match-patch/wiki/API\n' +
		'\tSemi-automatic Version Control:\n' +
		'\t\tKeep track of all edits automatically.\n' +
		'\t\tLabel and document versions at a later time using the editing history.\n' +
		'\tSyntax Highlighting and Code Completion:\n' +
		'\t\tThemeable syntax highlighting for a variety of programming languages.\n' +
		'\t\tCode completion hints for a variety of programming languages.\n' +
		'\t\tOpen source library for AWS Cloud9 front-end text editor\n' +
		'\t\t\thttps://github.com/ajaxorg/ace\n' +
		'\tSetup and Server Access (option 1, similar to AWS Cloud9):\n' +
		'\t\tWebsite is served by Lumos IDE’s server.\n' +
		'\t\tWebsite asks users to signup and upload target server SSH keys to their account.\n' +
		'\t\tUsers access their target server by authenticating with their user accounts.\n' +
		'\t\tFiles modified using Lumos IDE’s website interface runs the necessary SSH commands to perform the requested file modifications.\n' +
		'\t\tSAS design offers potential ways to generate revenue.\n' +
		'\tSetup and Server Access (option 2):\n' +
		'\t\tWebsite is served by the machine that the user wants to access via the website interface.\n' +
		'\t\tUsers “git clone” and runs a standalone server code.\n' +
		'\t\tUsers hardcode their login information on server-sided code for website authentication.\n' +
		'\t\tOpen source software limits ways to generate revenue.\n' +
		'\n' +
		'Potential Sources of Revenue:\n' +
		'\tLicensing:\n' +
		'\t\tOffering licenses to students via institutional contract.\n' +
		'\tRare User Data:\n' +
		'\t\tSelling or applying a singular form of data related to the user workflow (timeseries) of building a program. Application of data includes training of machine learning models for code completion that may offer more than mere keyword autocompletion.\n' +
		'\n' +
		'Areas of Focus:\n' +
		'\tCode Presentation:\n' +
		'\t\tWhat features do Comp Sci instructors want when teaching coding materials in lecture?\n' +
		'\t\tIs there a market for programming tutorage via an online platform?\n' +
		'\tCode Collaboration:\n' +
		'\t\tCan access to convenient collaboration tools benefit researchers?\n' +
		'\t\tAre users willing to trade-off certain resources for convenience?';
}

function get_text2() {
	let text =
		'// Syntax highlighting and warning\n' +
		'function print(items) {\n' +
		'\tfor (let item of items)\n' +
		'\t\tconsole.log(item)\n' +
		'\tconsole.log(and detects syntactic errors);\n' +
		'}' +
		'\n\n';
	text +=
		'// For a variety of languages\n' +
		'let supported_modes = [\n';
	for (let mode of modes)
		text += '\t\'' + mode + '\',\n';
	text += '];\n\n';

	text +=
		'// With default themes and the option to import them\n' +
		'let supported_themes = [\n';
	for (let theme of themes)
		text += '\t\'' + theme + '\',\n';
	text += '];\n\n';

	text +=
		'// TODO: Execute JavaScript code directly\n' +
		'$(function () {\n' +
		'\tprint(supported_modes);\n' +
		'\tprint(supported_themes);\n' +
		'});\n\n';

	text +=
		'// TODO: And connect external servers to run any code you want, on any device\n';
	return text;
}

/*
On document ready
 */

$(function () {
	initialize_drag_bar();

	manage_sizes();
	$(window).on('resize', manage_sizes);

	setInterval(update_passed_time, 10000);

	$('.toolbar_item').each(function () {
		let $this = $(this);
		$this.on('click', function () {
			let $target = $($this.data('target'));
			if ($target.css('display') === 'none')
				$target.css('display', 'block');
			else
				$target.css('display', 'none');
			if ($this.data('drag_bar')) {
				let $drag_bar = $($this.data('drag_bar'));
				if ($drag_bar.css('display') === 'none')
					$drag_bar.css('display', 'block');
				else
					$drag_bar.css('display', 'none');
			}
			manage_sizes();
		});
	});

	// for (let i in themes)
	// 	console.log(themes[i], ' : ', theme_files[i]);
	// for (let i in modes)
	// 	console.log(modes[i], ' : ', mode_files[i]);

	ace.require('ace/ext/language_tools');
	let editor1 = ace.edit('editor1');
	editor1.session.setMode('ace/mode/yaml');
	editor1.setTheme('ace/theme/jett');
	editor1.renderer.setScrollMargin(10, 0, 0, 10);
	editor1.setKeyboardHandler('ace/keyboard/sublime');
	editor1.setScrollSpeed(4);
	editor1.setOptions({
		wrap: true,
		// indentedSoftWrap: true,
		// showLineNumbers: false,
		autoScrollEditorIntoView: true,
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: false,
		enableSnippets: true,
		scrollPastEnd: 0.8,
	});
	editor1.setValue(get_text1(), -1);

	let editor2 = ace.edit('editor2');
	editor2.session.setMode('ace/mode/javascript');
	editor2.setTheme('ace/theme/jett');
	editor2.renderer.setScrollMargin(10, 0, 0, 10);
	editor2.setKeyboardHandler('ace/keyboard/sublime');
	editor2.setScrollSpeed(4);
	editor2.setOptions({
		autoScrollEditorIntoView: true,
		enableBasicAutocompletion: true,
		enableLiveAutocompletion: false,
		enableSnippets: true,
		scrollPastEnd: 0.8,
	});
	editor2.setValue(get_text2(), -1);
});
