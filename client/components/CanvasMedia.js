import React, {Component, Fragment} from 'react'
import {Image} from 'react-konva'
import {connect} from 'react-redux'
import { updateSingleMediaThunk, getSingleMedia } from '../store/content';
import { updateCurrentMediaThunk } from '../store/currentMedia';

class CanvasMedia extends Component {
  constructor(props) {
    super(props)
    this.state = {
        image: null
      };
      this.handleOnDragEnd = this.handleOnDragEnd.bind(this)
  }
      componentDidMount() {
        this.loadImage();
      }
      componentDidUpdate(oldProps) {
        if (oldProps.src !== this.props.src) {
          this.loadImage();
        }
      }
      componentWillUnmount() {
        this.image.removeEventListener('load', this.handleLoad);
      }
      loadImage() {
        this.image = new window.Image();
        this.image.src = this.props.src;
        this.image.addEventListener('load', this.handleLoad);
      }
      handleLoad = () => {
        this.setState({
          image: this.image
        });
      };

      handleOnDragMove = (event) => {
        if(this.props.id === this.props.selectedMedia){
          this.props.updateMediaOnDrag({
            xCoord: event.target.x(),
            yCoord: event.target.y(),
            width: event.target.scaleX(),
            height: event.target.scaleY(),
            rotation: event.target.rotation(),
          })
        }
      }

      handleOnDragEnd (event) {
        this.props.updateMedia(this.props.id, {
          xCoord: event.target.x(),
          yCoord: event.target.y(),
          width: event.target.scaleX(),
          height: event.target.scaleY(),
          rotation: event.target.rotation()
      })
      }

      handleOnMouseOver = (event) => {
        this.props.setSelectedMedia(this.props.id)
        this.props.updateMediaOnDrag({
          xCoord: event.target.x(),
          yCoord: event.target.y(),
          width: event.target.scaleX(),
          height: event.target.scaleY(),
          rotation: event.target.rotation(),
        })
      }

      render() {
        return (
          <Fragment>
              <Image
                x={this.props.xCoord}
                y={this.props.yCoord}
                scaleX={this.props.width}
                scaleY={this.props.height}
                rotation={this.props.rotation}
                image={this.state.image}
                ref={node => {
                  this.imageNode = node;
                }}
                name={this.props.name}
                draggable
                onMouseOver={this.handleOnMouseOver}
                onDragMove={this.handleOnDragMove}
                onDragEnd={this.handleOnDragEnd}
              />
          </Fragment>
        );
      }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateMedia: (id, updatedProp) => dispatch(updateSingleMediaThunk(id, updatedProp)),
    updateMediaOnDrag: (newProps) => dispatch(updateCurrentMediaThunk(newProps)),
    setSelectedMedia: (id) => dispatch(getSingleMedia(id))
  }
}

const mapStateToProps = (state) => {
  return {
  selectedMedia: state.content.selectedMedia
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CanvasMedia);
