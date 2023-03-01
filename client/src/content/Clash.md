# Clash

Duels are comprised of rounds of clashes.

A Round has this flow: Prepare -> Clash -> React

Gladiators will have 3 main health bars.
```
Hits: Physical damage, can be healed. 
Morale: Reputation
Stamina: 
```

If any of these stats hits 0, then the duel is over.

## Prepare

Prepare occurs before an Clash, this will look at the conditions of the battle, and one ability from prepare will be triggered. 
```
Light Heal:
If damaged heal 1 hp
```
```
Burn:
damage 1 hp
```

## Clash

At the start of the Clash, each gladiator will randomly pick an ability.  Both abilities will be compared to each other and have interactions, and win conditions.

Here is an example of a few:

Strike > Taunt > Dodge > Strike

```
Strike: Does medium _hit damage_, and medium _hit chance_.
Win condition: Do more damage than the other.
Stats used : Strength, Dexterity, Wisdom, luck
```
```
Dodge: Removes _hit chance_, at 0 _hit chance_ damage is removed.
Win condition: Do an successful dodge.
Stats used : Agility, Intelligence, Sensitivty, luck
```
```
Taunt: Does morale damage, and hit damage will reduce this effect.
Win condition: Do more morale damage.
Stats used : Reputation, charisma and luck
```

Win conditions produce points, and who ever has a 5% greater than other will win the round.


## React

React occurs after an Clash, this will take a look at the result and will see if it triggers an ability.

```
BackStab:
After an successful dodge, will do lots of damage based on agility.
Cooldown of 7 rounds
```