import 'package:flutter/material.dart';
import 'feed.dart';
import 'auth.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return const Directionality(
      textDirection: TextDirection.ltr, // specify the text directionality
      child: MaterialApp(
        title: 'My App',
        home: LoginScreen(),
      ),
    );
  }
}

class MainPage extends StatefulWidget {
  const MainPage({Key? key}) : super(key: key);

  @override
  _MainPageState createState() => _MainPageState();
}

class _MainPageState extends State<MainPage> {
  int index = 0;
  final screens = const [
    Feed(),
    Center(child: Text('Suggestions')),
    Center(child: Text('Profile')),
  ];

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Student Hub'),
      backgroundColor: Colors.white,
      elevation: 0,
      toolbarHeight: 60,
      titleTextStyle: const TextStyle(
        color: Colors.black,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      )
    ),
    body: screens[index],
    bottomNavigationBar: NavigationBar(
      selectedIndex: index,
      onDestinationSelected: (index) => setState(() => this.index = index),
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.feed_outlined),
          selectedIcon: Icon(Icons.feed),
          label: 'Feed',
        ),
        NavigationDestination(
          icon: Icon(Icons.lightbulb_outlined),
          selectedIcon: Icon(Icons.lightbulb),
          label: 'Suggestions',
        ),
        NavigationDestination(
          icon: Icon(Icons.person_outline),
          selectedIcon: Icon(Icons.person),
          label: 'Profile',
        ),
      ],
    ),
  );
}
