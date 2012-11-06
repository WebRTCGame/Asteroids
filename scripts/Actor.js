
/**
 * Actor base class.
 * 
 * Game actors have a position in the game world and a current vector to indicate
 * direction and speed of travel per frame. They each support the onUpdate() and
 * onRender() event methods, finally an actor has an expired() method which should
 * return true when the actor object should be removed from play.
 * 
 * @namespace Game
 * @class Game.Actor
 */
(function()
{
   Game.Actor = function(p, v)
   {
      this.position = p;
      this.vector = v;
      
      return this;
   };
   
   Game.Actor.prototype =
   {
      /**
       * Actor position
       *
       * @property position
       * @type Vector
       */
      position: null,
      
      /**
       * Actor vector
       *
       * @property vector
       * @type Vector
       */
      vector: null,
      
      /**
       * Actor game loop update event method. Called for each actor
       * at the start of each game loop cycle.
       * 
       * @method onUpdate
       */
      onUpdate: function onUpdate()
      {
      },
      
      /**
       * Actor rendering event method. Called for each actor to
       * render for each frame.
       * 
       * @method onRender
       * @param ctx {object} Canvas rendering context
       */
      onRender: function onRender(ctx)
      {
      },
      
      /**
       * Actor expiration test
       * 
       * @method expired
       * @return true if expired and to be removed from the actor list, false if still in play
       */
      expired: function expired()
      {
         return false;
      }
   };
})();



/**
 * EnemyActor base class.
 * 
 * An enemy actor is the common base class of actors that can be hit and destroyed by player bullets.
 * The class supports a hit() method which should return true when the enemy object should be removed from play.
 * 
 * @namespace Game
 * @class Game.EnemyActor
 */
(function()
{
   Game.EnemyActor = function(p, v)
   {
      this.position = p;
      this.vector = v;
      
      return this;
   };
   
   extend(Game.EnemyActor, Game.Actor,
   {
      alive: true,
      
      /**
       * Actor expiration test
       * 
       * @method expired
       * @return true if expired and to be removed from the actor list, false if still in play
       */
      expired: function expired()
      {
         return !(this.alive);
      },
      
      /**
       * Enemy hit by player bullet
       * 
       * @param force of the impacting bullet (as the enemy may support health)
       * @return true if destroyed, false otherwise
       */
      hit: function hit(force)
      {
         this.alive = false;
         return true;
      }
   });
})();


/**
 * EffectActor base class.
 * 
 * An actor representing a transient effect in the game world. An effect is nothing more than
 * a special graphic that does not play any direct part in the game and does not interact with
 * any other objects. It automatically expires after a set lifespan, generally the rendering of
 * the effect is based on the remaining lifespan.
 * 
 * @namespace Game
 * @class Game.EffectActor
 */
(function()
{
   Game.EffectActor = function(p, v, lifespan)
   {
      Game.EffectActor.superclass.constructor.call(this, p, v);
      this.lifespan = lifespan;
      this.effectStart = GameHandler.frameStart;
      return this;
   };
   
   extend(Game.EffectActor, Game.Actor,
   {
      /**
       * Effect lifespan in ms
       */
      lifespan: 0,
      
      /**
       * Effect start time
       */
      effectStart: 0,
      
      /**
       * Actor expiration test
       * 
       * @return true if expired and to be removed from the actor list, false if still in play
       */
      expired: function expired()
      {
      	// test to see if the effect has expired
      	return (GameHandler.frameStart - this.effectStart > this.lifespan);
      },
      
      /**
       * Helper for an effect to return the value multiplied by the ratio of the remaining
       * lifespan of the effect
       * 
       * @param val     value to apply to the ratio of remaining lifespans
       */
      effectValue: function effectValue(val)
      {
         var result = val - ((val / this.lifespan) * (GameHandler.frameStart - this.effectStart));
         // this is no longer a simple counter - so we need to crop the value
         // as the time between frames is not determinate
         if (result < 0) result = 0;
         else if (result > val) result = val;
         return result;
      }
   });
})();

