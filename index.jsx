import { connect, shallowEqual, useSelector } from 'react-redux'

const mapStateToProps = (state, ownProps) => {
  return {
    title: state.title,
    isLoading: state.isLoading,
    postsCount: state.posts.total,
    text: state.posts.textMap[ownProps.id],
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

const Parent = () => <Post id={2} />

export const Post = (props) => {
  const post = useSelector((state) => state.post, shallowEqual)
  const post02 = useSelector((state) => state.postsMap[props.id], shallowEqual)
  return (
    <Card>
      <CardTitle>{post.title}</CardTitle>
      <CardSubHeader>{post.viewsCount}</CardSubHeader>
      {post.body}
    </Card>
  )
}
