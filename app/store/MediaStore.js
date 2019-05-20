import { action, observable, computed, toJS } from 'mobx';
import { getUser, saveProfile, tokenCheck } from '../src/apiCalls/user';

class MediaStore {
  @observable limit = 10;
  @observable total = 0;
  @observable page = 0;
  @observable media = [];
  @observable search = "";
  @observable selectedMedia = [];
  @observable date = new Date();
  @observable mediaTags = [];
  @observable tag = "";

  @action.bound update = (k, v) => {
    this[k] = v;
  }
  @action.bound mediaResponse = (media) => {
    this.limit = media.limit;
    this.media = media.docs;
    this.page = Math.floor(media.offset / media.limit);
    this.total = media.totalDocs;
  }
  @action.bound dateChange = (date) => {
    this.date = date;
  }
}

export default MediaStore;
