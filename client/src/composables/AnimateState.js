class State {
  constructor(){
    this.states= {}
  }
  genDefaultState(){

    this.generateState("run","Left",[0,1,2,3,4,5]);
    this.generateState("run","Right",[0,1,2,3,4,5]);
    this.generateState("run","Up",[0,1,2,3,4,5]);
    this.generateState("run","Down",[0,1,2,3,4,5]);

    this.generateState("jump","Left",[0,1,2,0]);
    this.generateState("jump","Right",[0,1,2,0]);
    this.generateState("jump","Up",[0,1,2,0]);
    this.generateState("jump","Down",[0,1,2,0]);

  }
  generateState(animation, direction, arrayIndex, frames){
    animation = animation.toLowerCase();
    direction = direction.toLowerCase();
    direction = direction.toLowerCase().charAt(0).toUpperCase() + direction.slice(1)
    if(!frames) frames = 135;
    if (!this.states[animation]){
      this.states[animation] = {};
    }
    if(!this.states[animation][direction]){
        this.states[animation][direction] = {
          indexName: animation+direction,
          animationArray: arrayIndex,
          frames
        }
      }
  }
  getState(animation,direction){
    animation = animation.toLowerCase();
    direction = direction.toLowerCase();
    direction = direction.charAt(0).toUpperCase() + direction.slice(1)
    if( this.states[animation][direction] ){
      return this.states[animation][direction];
    }
  }
};
export default new State();