import Vue from 'vue'
import {
  Button, 
  Form,
  FormItem, 
  Input, 
  Row,
  Col, 
  Message, 
  Container, 
  Header, 
  Aside, 
  Main, 
  Menu, 
  Submenu, 
  MenuItemGroup, 
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  Checkbox,
  CheckboxGroup,
  Upload
} from 'element-ui'
//必须按需导入element UI组件

Vue.use(Button)
Vue.use(Form)    //导入组件后必须组成组件
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);
Vue.use(Cascader);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Upload);
//Message 需要全局导入到Vue实例中去，这样我们每个组件都能用$message来弹窗
Vue.prototype.$message = Message
Vue.prototype.$confirm=MessageBox.confirm