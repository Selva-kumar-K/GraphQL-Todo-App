const {GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLSchema, GraphQLNonNull} = require('graphql')
const Todo = require('./Todo')

const TodoType = new GraphQLObjectType({
  name : 'Todo',
  fields : {
    id : {type : GraphQLID},
    title : {type: GraphQLString},
    completed : {type : GraphQLBoolean}
  }
})

const QueryRootType = new GraphQLObjectType({
  name : 'Query',
  fields : {
    todos : {
      type : new GraphQLList(TodoType),
      resolve : (parent, args) => {
        return Todo.find({})
      }
    },

    todo : {
      type : TodoType,
      args : {id : {type : GraphQLID}},
      resolve: (parent, args) => {
        return Todo.findById(args.id)
      }
    }
  }
})

const Mutation = new GraphQLObjectType({
  name : 'Mutation',
  fields : {
    addTodos : {
      type : TodoType,
      args : {
        title : {type : GraphQLNonNull(GraphQLString)},
        completed : {type : GraphQLNonNull(GraphQLBoolean)}
      },
      resolve : async(parent, args) => {
        const newTask = new Todo({
          title : args.title,
          completed : false
        })

        return await newTask.save()
      }},

      updateTodo : {
        type : TodoType,
        args : {
          id : {type : GraphQLNonNull(GraphQLID)},
          title : {type : GraphQLString},
        },

        resolve: async(parent, args) => {

          const {id} = args
          const findId = await Todo.findById(id)
          if(!findId){
            return null
          }

          const updatedTodo = {
            title : args.title
          }

          return await Todo.findByIdAndUpdate(id, updatedTodo, {new: true})
          
        }
      },

      deleteTodo : {
        type : TodoType,
        args : {id : {type : GraphQLNonNull(GraphQLID)}},
        resolve: async(parent,args) => {
          const {id} = args
          const findId = await Todo.findById(id)
          if (!findId) {
            return "No ID Found"
          }

          return await Todo.findByIdAndDelete(id)
        }
      },

      toggleTodo : {
        type : TodoType,
        args: {id : {type : GraphQLNonNull(GraphQLID)}},
        resolve: async(parent, args) => {
          const todo = await Todo.findById(args.id)
          return await Todo.findByIdAndUpdate(args.id, {
            completed : !todo.completed
          }, {new : true})
        }
      }
    }
  })

module.exports = new GraphQLSchema({
  query : QueryRootType,
  mutation : Mutation
})


