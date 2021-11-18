
import std.stdio;

import gtk.MainWindow;
import gtk.Box;
import gtk.Main;
import gtk.Menu;
import gtk.MenuBar;
import gtk.MenuItem;
import gtk.Widget;
import gtk.Window;
import gtk.Paned;
import gtk.Image;
import gtk.ListBox;
import gtk.Label;
import gtk.DrawingArea;
import cairo.Context;
import gtk.FileChooserDialog;
import gdk.Event;

import trots.trots;
import trots.tfile;

void main(string[] args)
{
	TrotsWindow trotsWindow;
	printTrots();
	printTrots2();
	
	Main.init(args);
	trotsWindow = new TrotsWindow();
	Main.run();
    
} // main()


class TrotsWindow : MainWindow
{
	string title = "Menu with Multiple Items";

	this()
	{
		super(title);
		setDefaultSize(1200, 800);
		addOnDestroy(&quitApp);

		AppBox appBox = new AppBox(this);
		add(appBox);
		
		showAll();
		
	} // this()
	
	
	void quitApp(Widget w)
	{
		// do other exit stuff here if necessary
		
		Main.quit();
		
	} // quitApp()
	
} // trotsWindow


class AppBox : Box
{
	int padding = 10;
	TrotsMenuBar menuBar;
	
	this(Window parentWindow)
	{
		super(Orientation.VERTICAL, padding);
		
		menuBar = new TrotsMenuBar(parentWindow);
    	packStart(menuBar, false, false, 0);		
		TrotsPane mainPane = new TrotsPane();
		add(mainPane);
		
	} // this()
	
} // class AppBox


class TrotsMenuBar : MenuBar
{
	string fileHeaderLabel = "File";
	FileMenuHeader fileMenuHeader;
	
	this(Window parentWindow)
	{
		super();
		
		fileMenuHeader = new FileMenuHeader(fileHeaderLabel, parentWindow);
		append(fileMenuHeader);		
		
	} // this()

	
} // class TrotsMenuBar


class FileMenuHeader : MenuItem
{
	FileMenu fileMenu;
	
	// arg: a Menu object
	this(string headerTitle, Window parentWindow)
	{
		super(headerTitle);
		
		fileMenu = new FileMenu(parentWindow);
		setSubmenu(fileMenu);
		
		
	} // this()
	
} // class FileMenuHeader


class FileMenu : Menu
{
	NewFileItem newFileItem;
	ImportFileItem importFileItem;
	OpenFileItem openFileItem;
	CloseFileItem closeFileItem;
	ExitItem exitItem;
	
	// arg: an array of items
	this(Window parentWindow)
	{
		super();
		
		newFileItem = new NewFileItem();
		append(newFileItem);

		importFileItem = new ImportFileItem(parentWindow);
		append(importFileItem);
		
		openFileItem = new OpenFileItem();
		append(openFileItem);
		
		closeFileItem = new CloseFileItem();
		append(closeFileItem);
		
		exitItem = new ExitItem();
		append(exitItem);
		
	} // this()
	
	
} // class FileMenu


class NewFileItem : MenuItem
{
	string itemLabel = "New";
   
	this()
	{
		super(itemLabel);
		addOnActivate(&doSomething);
		
	} // this()
	
	
	void doSomething(MenuItem mi)
	{
		writeln("New file created.");
		
	} // doSomethingNew()
	
} // class NewFileItem


class OpenFileItem : MenuItem
{
	string itemLabel = "Open";
   
	this()
	{
		super(itemLabel);
		addOnActivate(&doSomething);
		
	} // this()
	
	
	void doSomething(MenuItem mi)
	{
		writeln("A file dialog will be shown now.");
		
	} // doSomething()
	
} // class OpenFileItem

class ImportFileItem : MenuItem
{
	string itemLabel = "Import";
	FileChooserDialog fileChooserDialog;
	Window parentWindow;
	string filename;
   
	this(Window extParentWindow)
	{
		super(itemLabel);
		addOnActivate(&doSomething);
		parentWindow = extParentWindow;
		
	} // this()
	
	
	void doSomething(MenuItem mi)
	{
		writeln("Import equity");
		int response;
		FileChooserAction action = FileChooserAction.OPEN;

		FileChooserDialog dialog = new FileChooserDialog("Import an Equity", parentWindow, action, null, null);
		response = dialog.run();

		if(response == ResponseType.OK)
		{
			filename = dialog.getFilename();
			importFile(filename);
		}
		else
		{
			writeln("cancelled.");
		}

		dialog.destroy();
		
	} // doSomething()

	void importFile(string filename)
	{
		writeln("file to import: ", filename);
	}
	
} // class OpenFileItem


class CloseFileItem : MenuItem
{
	string itemLabel = "Close";
   
	this()
	{
		super(itemLabel);
		addOnActivate(&doSomething);
		
	} // this()
	
	
	void doSomething(MenuItem mi)
	{
		writeln("The file is closed.");
		
		// If this was the last open file, 
		// ask the user if the the application should also be closed.
		
	} // doSomething()
	
} // class CloseFileItem


class ExitItem : MenuItem
{
	string itemLabel = "Exit";
   
	this()
	{
		super(itemLabel);
		addOnActivate(&doSomething);
		
	} // this()
	
	
	void doSomething(MenuItem mi)
	{
		Main.quit();
		
	} // exit()
	
} // class ExitItem


class TrotsPane : Paned
{
	this()
	{
		super(Orientation.HORIZONTAL);
		auto label1 = new Label("hello");
		auto label2 = new Label("there");
		auto trotsGraph = new DrawingBox();
		//auto child1 = new DrawingBox();
		auto child2 = new ListBox();

		child2.insert(label1,1);
		child2.insert(label2,2);
		add1(trotsGraph);
		add2(child2);
		
		
	} // this()
	
	
} // class TrotsPane

class TrotsGraphArea : DrawingArea
{
	this()
	{
		addOnDraw(&onDraw);
	}

	bool onDraw(Scoped!Context context, Widget w)
	{
		context.setLineWidth(3);
		context.moveTo(5,5);
		context.lineTo(100,200);
		context.stroke();
		return(true);
	}
}

class DrawingBox : Box
{
	TrotsGraphArea trotsGraph;
	this()
	{
		super(Orientation.VERTICAL, 10);
		setSizeRequest(800, 400);
		trotsGraph = new TrotsGraphArea();
		packStart(trotsGraph, true, true, 0);
	}
}