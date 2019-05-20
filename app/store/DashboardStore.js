import { action, observable, computed, toJS } from 'mobx';
import { getUser, saveProfile, tokenCheck } from '../src/apiCalls/user';
import moment from 'moment';

class DashboardStore {
  @observable tags = [];
  @observable selectedTags = [];
  @observable counts = {};
  @observable startTime = moment().subtract(7, 'd');
  @observable endTime = moment();
  @observable groupBy = ['count'];
  @observable queryName = "";
  @observable newTag = "";
  @observable groupBy = "day";
  @observable currentQuery = {};
  @observable minCount = 2;
  @observable reportType = "7-days";
  @observable loading = false;

  @action.bound update = (k, v) => {
    this[k] = v;
  }

  @action.bound updateDashboard = (k, v) => {
    this[k] = v;
  }

  @action.bound resetDashboard = () => {
    this.counts = {};
    this.tags = [];
    this.currentQuery = {};
  }

  @action.bound dashboardResponse = ({ counts, tags }) => {
    this.counts = counts;
    this.tags = tags;
  }

  @action.bound clear = () => {
    this.selectedTags = [];
  }

  @action.bound dateChange = (which) => (date) => {
    this[which] = date;
  }
}

export default DashboardStore;
