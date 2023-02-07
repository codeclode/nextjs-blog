---
title: "react-router"
date: "2023-01-26"
---

# React-Router基本使用

## 开始渲染

使用提供的createBrowserRouter配合RouterProvider传输

```react
const router = createBrowserRouter([
  {
    path: "/",
    element: (<h1>Hello World</h1>),
  },
]);
createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
```

## 嵌套路由和动态路由

```react
const router = createBrowserRouter([
  {
    path: "/",
    element: (<><h1>Hi</h1><OutLet/></>),
    children:[
      {
        path:"login",
        element:<Login/>
      },
      {
        loader:({params})=>{//loader用来获取一些预备数据
          params.id//可以得到id值
        },
        action:({params})=>{//action用来执行进入该路由的操作，比如表单数据提交
            //同样可以获取params
        }
        path:"user/:id",
        element:<User/>
      }
    ]
  },
]);
//User
function User(){
  const params = useParams();
  params.id;
}
```

## 路由排序

我们不需要把更加精确的路由放到上边，React-Router会帮我们匹配最精确的路由

```react
<Route path="/teams/:teamId" />
<Route path="/teams/new" />
//即使如此，teams/new仍然进入teams/new而非teams/:teamId
```

## 关于link

```react
<Link to="/abc"></Link>
<NavLink
  style={({ isActive, isPending }) => {
    return {
      color: isActive ? "red" : "inherit",
    };
  }}
  className={({ isActive, isPending }) => {
    return isActive ? "active" : isPending ? "pending" : "";
  }}
/>
```

NavLink是特殊的Link，我们可以方便地知道当前Link是否被激活。

to属性在没有前缀/时是相对的，它甚至支持.和..运算符代表当前和上一级路径

## Loader和Redirects

```react
<Route
  path="/"
  loader={async ({ request }) => {
    const res = await fetch("/api/user.json", {
      signal: request.signal,
    });
    const user = await res.json();
    return user;
  }}
  element={<Root />}
/>
//Root
function Root() {
  const user = useLoaderData();//获取loader返回的数据
  const navigation = useNavigation();//获取当前的路由状态
  return (
    <div>
      {navigation.state === "loading" && <GlobalSpinner/>}
      <Outlet />
    </div>
  );
}
```

```react
<Route
  path="dashboard"
  loader={async () => {
    const user = await fake.getUser();
    if (!user) {
      throw redirect("/login");//在loader中重定向要throw
    }
    const stats = await fake.getDashboardStats();
    return { user, stats };
  }}
/>

<Route
  path="project/new"
  action={async ({ request }) => {
    const data = await request.formData();
    const newProject = await createProject(data);
    return redirect(`/projects/${newProject.id}`);//在action里return 
  }}
/>
```

## 异步的loader数据

通过defer可以实现先跳转，在搞数据

```react
<Route
  path="issue/:issueId"
  element={<Issue />}
  loader={async ({ params }) => {
    const comments = fake.getIssueComments(params.issueId);
    const history = fake.getIssueHistory(params.issueId);
    // defer enables suspense for the un-awaited promises
    return defer({  comments, history });
  }}
/>;

function Issue() {
  const {  history, comments } = useLoaderData();
  return (
    <div>
      {/* fallback：数据没到之前的骨架屏 */}
      <Suspense fallback={<IssueHistorySkeleton />}>
        {/* 等着Await里的resolve号了我就渲染里边那个组件 */}
        <Await resolve={history}>
          {(resolvedHistory) => (<IssueHistory history={resolvedHistory} />)}
        </Await>
      </Suspense>
      <Suspense fallback={<IssueCommentsSkeleton />}>
        <Await resolve={comments}>
          {/* 也可以使用另一种函数式组件处理 */}
          <IssueComments />
        </Await>
      </Suspense>
    </div>
  );
}

function IssueComments() {
  const comments = useAsyncValue();//注意这个钩子来获取得到的comments
  return <div>{/* ... */}</div>;
}
```

## 错误处理

```react
<Route
  path="/"
  loader={() => {
    something.that.throws.an.error();
  }}
  // this will not be rendered
  element={<HappyPath />}
  // but this will instead
  errorElement={<ErrorBoundary />}//承接错误的组件
/>
```

## 表单

在一个组件里有这样一个表单

```react
function NewProjectForm() {
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";//当前的路由状态
  return (
    <Form action="/project/new">
      <fieldset disabled={busy}>
        <label>
          Project title
          <br />
          <input type="text" name="title" />
        </label>

        <label>
          Target Finish Date
          <br />
          <input type="date" name="due" />
        </label>
      </fieldset>
      <button type="submit" disabled={busy}>
        {busy ? "Creating..." : "Create"}
      </button>
    </Form>
  );
}
```

当其提交后会跳转到project/new下，如此定义这个路由的action

```react
<Route
  path="project/new"
  action={async ({ request }) => {
    const formData = await request.formData();
    const newProject = await createProject({
      title: formData.get("title"),
      due: formData.get("due"),
    });
    return redirect(`/projects/${newProject.id}`);
  }}
/>
```

还有一个useFetcher钩子，它返回的fetcher可以帮进行数据的加载和上传（编程式的loader和action），同时可以获取表单信息和当前提交的状态等内容。在API部分细说。

# API

## Routers

- createBrowserRouter->历史记录型的router
- createHashRouter->Hash型的router（官方不推荐）
- createMemoryRouter->react-router在内存里自己搞一个历史记录栈而不是使用浏览器历史记录，方便在非浏览器环境运行。
- \<RouterProvider router={router} fallbackElement={Spinner}>：包裹需要路由的组件（一般就是根组件），fallbackElement，提供一个加载中告诉用户我正在加载(loader)。

## 相关组件

- \<BrowserRouter>:里面嵌套Route标签，其实就是把Routers里的函数式创建变成JSX式创建
- \<HashRouter>
- \<MemoryRouter>
- StaticRouter:服务端渲染相关

## Route

```typescript
interface RouteObject {
  path?: string;
  index?: boolean;
  children?: React.ReactNode;
  caseSensitive?: boolean;
  id?: string;
  loader?: LoaderFunction;
  action?: ActionFunction;
  element?: React.ReactNode | null;
  errorElement?: React.ReactNode | null;
  handle?: RouteObject["handle"];
  shouldRevalidate?: ShouldRevalidateFunction;
}//这种语法是JSX的接口
```

### path

- 对于动态参数，react-router不支持："/team-:id"，只能"/:teamId"，前者不会报错，只不过我们要自己解析
- 可选参数： "/:lang?/categories" ，匹配/en/categories,/fr/categories,/categories 
- 匹配一切："/user/*"，可以匹配任何以user开头的路径，不过想要获取后边的参数，只能params\["\*"\]

### index

代表这个route是父组件的root组件，匹配父亲的路径

```react
<Route path="/teams" element={<Teams />}>
  <Route index element={<TeamsIndex />} />
  <Route path=":teamId" element={<Team />} />
</Route>
```

### caseSensitive

是否区分url大小写

### element、errorElement

原始渲染的组件和子路由出错时现实的组件

### loader和action（注意，如果不是createxxxRouter则不支持）

loader->进入之前的一些准备

- params，读取动态路由的参数
- 参数request，只有url等信息
- 可以返回任何东西，在进入组件之后使用useLoaderData()获取

action->通过 "post", "put", "patch", "delete" 方法进入此路由之后触发的行为

- 参数params，读取动态路由的参数
- 参数request，跳转的时候带过来的请求
- 可以返回任何东西，并且可以在组件里使用useActionData()获取到

二者可以通过throw一些对象来实现转移到errorElement

## 内置组件

### Await

使用步骤见**异步的loader数据**

### Form

Router版表单

- action：提交地址
- method：提交方法 "put", "patch","delete","get" and "post".默认"get".
- replace:boolean,使用replace history而不是默认的push history跳转
- reloadDocument提交以后刷新页面而不是跳转路由

### Link

- to
- replace
- state：传递给目标路由的参数，通过useLocation获取
- preventScrollReset：是否阻止ScrollRestoration重置滚动状态

### NavLink

- 和Link一样
- className和style以函数形式传参接收isActive和isPending确定当前Link的状态
- end属性代表是否精确匹配路由

### Outlet

组件在何处渲染

### ScrollRestoration

通过key选择性地维持路由切换时的滚动状态

```react
<ScrollRestoration
  getKey={(location, matches) => {
    const paths = ["/home", "/notifications"];
    return paths.includes(location.pathname)
      ? // home and notifications restore by pathname
        location.pathname
      : // everything else by location like the browser
        location.key;
  }}
/>
```

## hooks

### useActionData

获取此路由action的返回值

### useLoaderData

获取loader的返回值

### useRouteLoaderData

```react
createBrowserRouter([
  {
    path: "/",
    loader: () => fetchUser(),
    element: <Root />,
    id: "root",
    children: [
      {
        path: "jobs/:jobId",
        loader: loadJob,
        element: <JobListing />,
      },
    ],
  },
]);
```

```react
const user = useRouteLoaderData("root");
//可以在任何地方获得root组建的loaderData
```

### useAsyncError

用在Await组件里，如果Await组件的resolve出现了reject的情况会跳转到对应的errorElement，在errorElement里面调用这个hook可以得到返回的错误信息

### useAsyncValue

类比上一个hook，Await成功的结果

### useBeforeUnload

在用户离开页面之前调用，方便将重要的应用程序状态保存在页面上。

### useInRouterContext

判断当前是否在Router环境下

### useLocation

返回一个location对象，里边有state、hash、search等内容（不是BOM的那个）

### useNavigation

返回当前路由的状态

```typescript
import { useNavigation } from "react-router-dom";

function SomeComponent() {
  const navigation = useNavigation();
  navigation.state;//idle 加载完成，loading，submitting
  navigation.location;//当前正在前往哪里
  navigation.formData;
  navigation.formAction;
  navigation.formMethod;
}
```

### useParams

获取动态路由参数

### useSearchParams

```react
import * as React from "react";
import { useSearchParams } from "react-router-dom";

function App() {
  let [searchParams, setSearchParams] = useSearchParams();
  //searchParams是一个URLsearchParams对象（JS的一个基础对象）
  function handleSubmit(event) {
    event.preventDefault();
    let params = serializeFormQuery(event.target);
    setSearchParams(params);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>{/* ... */}</form>
    </div>
  );
}
```

### useMatch

```javascript
function Random() {
  const match = useMatch(
    "/projects/:projectId/tasks/:taskId"
  );//传入一个匹配模式返回匹配结果
  match.params.projectId; // abc
  match.params.taskId; // 3
}
```

### useNavigate

```react
const userIsInactive = useFakeInactiveUser();
navigate("/session-timed-out",{
      replace?: boolean;
      state?: any;
});//编程式路由导航
navigate(n:number)//历史记录
```

### useOutletContext

```react
function Parent() {
  const [count, setCount] = React.useState(0);
  return <Outlet context={[count, setCount]} />;
}

function Child() {
  const [count, setCount] = useOutletContext();
  const increment = () => setCount((c) => c + 1);
  return <button onClick={increment}>{count}</button>;
}
```

### useFetcher

实现编程式的表单路由导航，并且可以实现不跳转提交数据

```react
const fetcher = useFetcher();
  React.useEffect(() => {
    fetcher.submit(
      { idle: true },//data
      { method: "post", action: "/logout" }//option
    );
    fetcher.load("/some/route");//加载后的数据放到data里
  }, [fetcher]);

  // build your UI with these properties
  fetcher.state;//三个状态idle、loading（调用load）、submitting（调用submit）
  fetcher.formData;//fetcher.Form表单内容的对象，这也解释了为什么是(实例.Form)（防止两个Form冲突）
  fetcher.formMethod;//当前是post
  fetcher.formAction;//当前是/some/route
  fetcher.data;
  return <fetcher.Form method="post" action="/some/route"/>;
}
```

