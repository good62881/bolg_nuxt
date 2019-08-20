import Vue from "vue";
import {Row,Col,Card,Dialog,Input,InputNumber,Checkbox,Button,Select,Option,DatePicker,Form,FormItem,Table,TableColumn,Dropdown,DropdownMenu,DropdownItem,Pagination,Menu,Submenu,MenuItem,Upload,Tag,Switch,Tooltip,Popover,scrollbar,Loading,Message,MessageBox} from "element-ui";

Vue.use(Row);
Vue.use(Col);
Vue.use(Card);
Vue.use(Dialog);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Checkbox);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Pagination);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Upload);
Vue.use(Tag);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Popover);
Vue.use(scrollbar);

Vue.use(Loading.directive);

Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
