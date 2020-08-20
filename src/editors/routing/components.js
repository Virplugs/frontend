import project from '../../project';

import Rete from 'rete';
import NumControlComponent from './components/NumControlComponent.vue';
import CustomNodeComponent from './components/CustomNodeComponent.vue';
import ParameterComponent from './components/ParameterComponent.vue';

export const audioSocket = new Rete.Socket('Audio');
export const midiSocket = new Rete.Socket('MIDI');
export const numSocket = new Rete.Socket('Number');

numSocket.combineWith(audioSocket);

export class NumControl extends Rete.Control {

	constructor(emitter, key, readonly) {
		super(key);
		this.component = NumControlComponent;
		this.props = { emitter, ikey: key, readonly };
	}

	setValue(val) {
		this.vueContext.value = val;
	}
}

export class RouteComponent extends Rete.Component {
	constructor(name) {
		super(name);
		this.data.component = CustomNodeComponent;
	}
}

export class AltComponent extends RouteComponent {
	constructor() {
		super("Alternative");
	}

	builder(node) {
		var out1 = new Rete.Output('alt', "Altur", audioSocket);
		var out2 = new Rete.Output('alt2', "Altsf", midiSocket);
		var out3 = new Rete.Output('alt3', "Altbb", numSocket);

		return node.addOutput(out1).addOutput(out2).addOutput(out3);
	}

	worker(node, inputs, outputs) {
		outputs['num'] = node.data.num;
	}
}

export class StereoOutputComponent extends RouteComponent {
	constructor() {
		super("Stereo Output");
	}

	builder(node) {
		var left = new Rete.Input('left', "Left", audioSocket);
		var right = new Rete.Input('right', "Right", audioSocket);

		return node.addInput(left).addInput(right);
	}

	worker(node, inputs, outputs) {
		//outputs['num'] = node.data.num;
	}
}

export class SumComponent extends RouteComponent {
	constructor() {
		super("Sum");
	}

	builder(node) {
		var a = new Rete.Input('a', "A", audioSocket);
		var b = new Rete.Input('b', "B", audioSocket);
		var out = new Rete.Output('out', "Out", audioSocket);

		return node.addInput(a).addInput(b).addOutput(out);
	}

	worker(node, inputs, outputs) {
		//outputs['num'] = node.data.num;
	}
}

export class NumComponent extends RouteComponent {
	constructor() {
		super("Number");
	}

	builder(node) {
		var out1 = new Rete.Output('num', "Number", audioSocket);

		return node.addControl(new NumControl(this.editor, 'num')).addOutput(out1);
	}

	worker(node, inputs, outputs) {
		outputs['num'] = node.data.num;
	}
}

export class AddComponent extends RouteComponent {
	constructor() {
		super("Add");
	}

	builder(node) {
		var inp1 = new Rete.Input('num', "Number", audioSocket);
		var inp2 = new Rete.Input('num2', "Number2", audioSocket);
		var out = new Rete.Output('num', "Number", audioSocket);

		inp1.addControl(new NumControl(this.editor, 'num'));
		inp2.addControl(new NumControl(this.editor, 'num2'));

		return node
			.addInput(inp1)
			.addInput(inp2)
			.addInput(new Rete.Input('num3', "Number3", audioSocket))
			.addInput(new Rete.Input('num4', "Number4", audioSocket))
			.addInput(new Rete.Input('num5', "Number5", audioSocket))
			.addInput(new Rete.Input('num6', "Number6", audioSocket))
			.addInput(new Rete.Input('num7', "Number7", audioSocket))
			.addInput(new Rete.Input('num8', "Number8", midiSocket))
			.addControl(new NumControl(this.editor, 'preview', true))
			.addOutput(out);
	}

	worker(node, inputs, outputs) {
		var n1 = inputs['num'].length ? inputs['num'][0] : node.data.num1;
		var n2 = inputs['num2'].length ? inputs['num2'][0] : node.data.num2;
		var sum = n1 + n2;

		this.editor.nodes.find(n => n.id == node.id).controls.get('preview').setValue(sum);
		outputs['num'] = sum;
	}
}

export class ParameterRouteComponent extends RouteComponent {
	constructor(name, isPlaceholder = false) {
		super("Parameter: " + name);
		this.data.component = ParameterComponent;
		this.parameterName = name;
		this.data.props = {
			isPlaceholder
		};
	}

	builder(node) {
		var out = new Rete.Output(this.parameterName, this.parameterName, numSocket);

		return node.addOutput(out);
	}

	worker(node, inputs, outputs) {
	}
}

export function getParametersFromProjectFile() {
	const fs = nodeRequire('fs');
	const path = nodeRequire('path');
	let data = JSON.parse(fs.readFileSync(path.join(project.location, project.filename),
		{ encoding: 'utf8' }));
	return data.parameters;
}


export function getParameterComponents() {
	let comps = [];
	getParametersFromProjectFile().forEach(param => {
		let comp = new ParameterRouteComponent(param.title);
		comps.push(comp);
	});
	return comps;
}

export function createParameterPlaceholders(jsonData, editor, engine) {
	Object.keys(jsonData.nodes).forEach(nodeId => {
		const node = jsonData.nodes[nodeId];
		const component = editor.components.get(node.name);
		if (!component && node.name.startsWith("Parameter: ")) {
			const parameterName = node.name.replace(/^Parameter: /, '');
			// Parameter doesn't exist, so create a placeholder Just-in-Time
			console.log(`JIT-registering component '${parameterName}' as placeholder`);
			console.warn(
				`${window.editorFilename} references undefined parameter '${parameterName}'`);
			const comp = new ParameterRouteComponent(parameterName, true);
			editor.register(comp);
			engine.register(comp);
		}
	});
}

export function loadComponents() {
	return [
		new NumComponent(),
		new AddComponent(),
		new AltComponent(),
		new StereoOutputComponent(),
		new SumComponent(),
		...getParameterComponents()
	];
}
