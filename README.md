# mapStateToPros from react-redux

`mapStateToPros`

- **It is called every time the store state changes.**
- **It receives the entire store state, and should return an object of data this component needs.**
- **Each field in the object will become a prop for your actual component**
- **The _values_ in the fields will be used to determine if your component needs to re-render**

```js
import { connect } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.title,
    isLoading: state.isLoading,
    postsCount: state.posts.total,
    text: state.posts.textMap[ownProps.id],
    arr: state.posts.map((post) => ({ ...post, newProp: Date.now() })),
    nestedObj: state.posts, // obj
  }
}

export const Posts = connect(mapStateToProps)((props) => {
  return (
    <Card>
      <CardTitle>{props.title}</CardTitle>
      <CardSubHeader>{props.postsCount}</CardSubHeader>
      {props.isLoading && <Spinner />}
    </Card>
  )
})

const Parent = () => <Posts id={2} />
```

## Object.is()

`Object.is()` determines whether two values are the same value. Two values are the same if one of the following holds:

- both `undefined`
- both `null`
- both `true` or `both` false
- both `strings` of the `same length` with the `same characters` in the `same order`
- both the same object (meaning both values reference the same object in memory)
- both `numbers` and
  - both `+0`
  - both `-0`
  - both `NaN`
  - or both `non-zero` and both not `NaN` and both **have the same value**

```js
const { is } = Object
is(1, 1) // true
is({}, {}) // false
const obj = {}
is(obj, obj) // true
const newObj = obj
is(obj, newObj) // true
is([], []) // false
const arr = [1, 2]
const newArr = [1, 2]
is(arr, newArr) // false
const xArr = arr
is(xArr, arr) // true
```

[a link to the shallowEqual function from react](https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/shallowEqual.js#L39-L67)

> Returning arrays or objects (nested) from the `mapStateToPros` (`{name: 'rowadz', arr: [1, 2] obj: {age: 20}}`) will **always** force the component to re-render on each time the redux state changes.

## React.memo is similar

`React.memo` is a higher order component.

If your component renders the same result given the same props, you can wrap it in a call to `React.memo` for a performance boost in some cases by memoizing the result. This means that React will skip rendering the component, and reuse the last rendered result.

> `React.memo` only checks for prop changes. If your function component wrapped in `React.memo` has a `useState`, `useReducer` or `useContext` Hook in its implementation, it will still rerender when state or context change.

**By default it will only shallowly compare complex objects in the props object. If you want control over the comparison, you can also provide a custom comparison function as the second argument.**

> Passing arrays or objects in the props (`{name: 'rowadz', arr: [1, 2] obj: {age: 20}}`) will make .memo useless.

# useSelector hook from react-redux

```js
const result: any = useSelector(selector: Function, equalityFn?: Function)
```

- The selector will be called with the entire Redux store state as its only argument.

- The selector will be run whenever the function component renders (unless its reference hasn't changed since a previous render of the component so that a cached result can be returned by the hook without re-running the selector).

- The selector may return any value as a result, not just an object. The return value of the selector will be used as the return value of the `useSelector()` hook.

- When an action is dispatched, `useSelector()` will do a reference comparison of the previous selector result value and the current result value. If they are different, the component will be forced to re-render. If they are the same, the component will not re-render.

- **`useSelector()` uses strict `===` reference equality checks by default, not shallow equality.**

> You may call `useSelector()` multiple times within a single function component. Each call to `useSelector()` creates an individual subscription to the Redux store. Because of the React update batching behavior used in React Redux v7, a dispatched action that causes multiple `useSelector()`s in the same component to return new values should only result in a single re-render.

> With `mapStateToPros`, all individual fields were returned in a combined object. It didn't matter if the return object was a new reference or not - `connect()` just compared the individual fields. With `useSelector()`, returning a new object every time will always force a re-render by default. If you want to retrieve multiple values from the store, you can:

- Call `useSelector()` multiple times, with each call returning a single field value
- Use `Reselect` or a similar library to create a memoized selector that returns multiple values in one object, but only returns a new object when one of the values has changed.
- Use the `shallowEqual` function from React-Redux as the equalityFn argument to `useSelector()`, like:

```js
import { shallowEqual, useSelector } from 'react-redux'
import { useCallback, memo } from 'react'

// post = {body: string, id: number, viewsCount: number, title: string}
// postsMap = {2: {body: string, id: number, viewsCount: number, title: string }}

const Parent = () => <Post id={2} />

const postSelector = (state) => state.post

export const Post = memo((props) => {
  const postSelector02 = useCallback(
    (state) => state.postsMap[props.id],
    [props]
  )

  const views = useSelector((state) => state.post.viewsCount)

  const post = useSelector(postSelector, shallowEqual)
  const post02 = useSelector((state) => state.postsMap[props.id], shallowEqual)
  const post03 = useSelector(postSelector02, shallowEqual)

  return (
    <Card>
      <CardTitle>{post.title}</CardTitle>
      <CardSubHeader>{post.viewsCount}</CardSubHeader>
      {post.body}
    </Card>
  )
})
```

> Returning arrays or objects (nested) from the `useSelector` selector function (`{name: 'rowadz', arr: [1, 2] obj: {age: 20}}`) will **always** force the component to re-render on each time the selector function will be called.