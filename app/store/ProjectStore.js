import { action, observable, computed, toJS } from 'mobx';
import { getUser, saveProfile, tokenCheck } from '../src/apiCalls/user';

class ProjectStore {
  @observable name = ""
  @observable id = "";
  @observable tags = [];
  @observable tag = "";
  @observable projects = [];
  @observable team = {};
  @observable asset = {
    name: '',
  };
  @observable media = [];

  // Video FPS
  @observable videoFidelity = "-1";
  @observable applyTagsToImagesFromThisVideo = [];
  @observable videoTagInProgress = "";
  @observable convertVideoDialogOpen = 0;
  @observable videoGrouping = "group";

  // create project modal
  @observable createProjectModalOpen = false;
  @observable newProjectName = "";

  @action.bound update = (k, v) => {
    this[k] = v;
  }

  @action.bound setProject = (project) => {
    this.name = project.name;
    this.id = project.id;
    this.team = project.team;
    this.tags = project.tags;
  }

}

export default ProjectStore;
