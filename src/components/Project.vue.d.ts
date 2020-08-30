import Vue from 'vue';
import _Project from '@/project';

export default class Project extends Vue {
	project: _Project;
	FLAG__isRootProject: boolean;

	groupSelected();
	deleteSelected();
}
