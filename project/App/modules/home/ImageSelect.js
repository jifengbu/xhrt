import React from 'react';
import {
    View,
    ScrollView,
    InteractionManager,
    PanResponder,
} from 'react-native';

const ViewPager = React.createClass({
    componentWillMount() {
        var _scrollView: ScrollView;
        this.scrollView = _scrollView;
        this.addIndex = false;

        this._panResponder = PanResponder.create({
          onPanResponderGrant: (evt, gestureState) => {
                console.log('touch-start');
                this.addIndex = true;
          },
          onPanResponderRelease: (evt, gestureState) => {
              this.addIndex = false;

              console.log('touch-end-xx----', this.lastSelectedIndex);

                 if (this.lastSelectedIndex < 0) this.lastSelectedIndex=0;
                 if (this.lastSelectedIndex > this.props.pageCount-1) this.lastSelectedIndex=this.props.pageCount-1;

                InteractionManager.runAfterInteractions(() => {
                    this.scrollView.scrollTo({x: sr.ws(254*this.lastSelectedIndex)});
                });
                if (this.props.afterChange) {
                    this.props.afterChange(this.lastSelectedIndex);
                }
          },
          onPanResponderMove: (evt, gestureState) => {
                let selectedIndex = Math.ceil(gestureState.dx / this.props.width);
                // console.log('touch-Move-xx----1', this.lastSelectedIndex, selectedIndex);

                if (selectedIndex > -1 && selectedIndex < 1) {
                    return;
                }else {
                    if (this.addIndex) {
                        // console.log('touch-Move-xx----2', this.lastSelectedIndex, selectedIndex);
                        let tempIndex = this.lastSelectedIndex - selectedIndex;
                        if (tempIndex != this.lastSelectedIndex) {
                            this.lastSelectedIndex = tempIndex;
                            this.addIndex = false;

                            if (this.lastSelectedIndex < 0) this.lastSelectedIndex=0;
                            if (this.lastSelectedIndex > this.props.pageCount-1) this.lastSelectedIndex=this.props.pageCount-1;

                           InteractionManager.runAfterInteractions(() => {
                               this.scrollView.scrollTo({x: sr.ws(254*this.lastSelectedIndex)});
                           });
                           if (this.props.afterChange) {
                               this.props.afterChange(this.lastSelectedIndex);
                           }
                        }
                    }
                }
          },
        });
    },
    componentDidMount() {
        this.stopScroll = false;
        this.lastSelectedIndex = this.props.selectedIndex;
        if (this.props.children.length > 2) {
            InteractionManager.runAfterInteractions(() => {
                setTimeout(()=>{
                    this.scrollView.scrollTo({x: sr.ws(254)});
                }, 200);
            });
        }
    },
    onWillFocus() {
        console.log('onWillFocus---');
        InteractionManager.runAfterInteractions(() => {
            this.scrollView.scrollTo({x: sr.ws(254*this.lastSelectedIndex)});
        });
    },
    onScroll(e) {
        // android incompatible
        if (!e.nativeEvent.contentOffset) {
            e.nativeEvent.contentOffset = {x: e.nativeEvent.position * this.props.width};
        }
        this.updateIndex(e.nativeEvent.contentOffset.x);
    },
    onScrollBegin(e) {
        // console.log('onScrollBegin');
        // this.stopScroll = true;
    },
    onScrollEnd(e) {
        console.log('onScrollEnd');
        if (this.addIndex) {
            if (this.lastSelectedIndex < 0) this.lastSelectedIndex=0;
            if (this.lastSelectedIndex > this.props.pageCount-1) this.lastSelectedIndex=this.props.pageCount-1;

            console.log('onScrollEnd---', this.lastSelectedIndex);
           InteractionManager.runAfterInteractions(() => {
               this.scrollView.scrollTo({x: sr.ws(254*this.lastSelectedIndex)});
           });
           if (this.props.afterChange) {
               this.props.afterChange(this.lastSelectedIndex);
           }
       }
       if (app.isandroid) {
           if (this.lastSelectedIndex < 0) this.lastSelectedIndex=0;
           if (this.lastSelectedIndex > this.props.pageCount-1) this.lastSelectedIndex=this.props.pageCount-1;

           console.log('onScrollEnd---', this.lastSelectedIndex);
          InteractionManager.runAfterInteractions(() => {
              this.scrollView.scrollTo({x: sr.ws(254*this.lastSelectedIndex)});
          });
          if (this.props.afterChange) {
              this.props.afterChange(this.lastSelectedIndex);
          }
       }
    },
    onTouchEnd(e) {
        console.log('onTouchEnd');
        if (app.isandroid) return;

        if (this.lastSelectedIndex < 0) this.lastSelectedIndex=0;
        if (this.lastSelectedIndex > this.props.pageCount-1) this.lastSelectedIndex=this.props.pageCount-1;

       InteractionManager.runAfterInteractions(() => {
           this.scrollView.scrollTo({x: sr.ws(254*this.lastSelectedIndex)});
       });
       if (this.props.afterChange) {
           this.props.afterChange(this.lastSelectedIndex);
       }
    },
    updateIndex(x) {
        let {width, afterChange, pageCount} = this.props;
        let selectedIndex = Math.ceil((x) / width);

        console.log('selectedIndex---', selectedIndex);
        if (this.lastSelectedIndex!==selectedIndex) {
            this.lastSelectedIndex = selectedIndex;

            // console.log('selectedIndex---updateIndex', this.lastSelectedIndex);
        }
    },
    render() {
        let {width, height} = this.props;
        let pages = this.props.children.map((page, i) => {
            return (<View style={{width, height}} key={i}>{page}</View>);
        });
        return (
            <ScrollView ref={(scrollView) => { this.scrollView = scrollView; }}
                horizontal={true}
                pagingEnabled={false}
                removeClippedSubviews={true}
                automaticallyAdjustContentInsets={false}
                directionalLockEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1000}
                onScroll={this.onScroll}
                onMomentumScrollEnd={this.onScrollEnd}
                onTouchEnd={this.onTouchEnd}
                {...this._panResponder.panHandlers}>
                <View style={{width: sr.ws((sr.w-254-20)/2)}}/>
                {pages}
                <View style={{width: sr.ws((sr.w-254-20)/2)}}/>
            </ScrollView>
        );
    },
});

module.exports = ViewPager;
