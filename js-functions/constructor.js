// Constructor function (older OOP style before classes)

function User(name, age) {
  // "this" refers to the new object being created
  this.name = name;
  this.age = age;

  this.introduce = function () {
    console.log(
      "Hi, I am " + this.name + " and I am " + this.age + " years old."
    );
  };
}

// Create objects using "new"
const user1 = new User("Ankit", 20);
const user2 = new User("Exodus", 22);

user1.introduce();
user2.introduce();
