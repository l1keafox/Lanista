class State {
  constructor(){
    this.states= {}
  }
  genDefaultState(){
    this.generateState("walk","Left",[0,1,2,3,4,5]);
    this.generateState("walk","Right",[0,1,2,3,4,5]);
    this.generateState("walk","Up",[0,1,2,3,4,5]);
    this.generateState("walk","Down",[0,1,2,3,4,5]);

    this.generateState("stand","Left",[0]);
    this.generateState("stand","Right",[0]);
    this.generateState("stand","Up",[0]);
    this.generateState("stand","Down",[0]);

    this.generateState("push","Left",[0,0,1,1]);
    this.generateState("push","Right",[0,0,1,1]);
    this.generateState("push","Up",[0,0,1,1]);
    this.generateState("push","Down",[0,0,1,1]);

    this.generateState("pull","Left",[0,0,0,1,1,1]);
    this.generateState("pull","Right",[0,0,0,1,1,1]);
    this.generateState("pull","Up",[0,0,0,1,1,1]);
    this.generateState("pull","Down",[0,0,0,1,1,1]);

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