import tkd.tkdapplication;                               // Import Tkd.

class Application : TkdApplication                       // Extend TkdApplication.
{
	private void exitCommand(CommandArgs args)           // Create a callback.
	{
		this.exit();                                     // Exit the application.
	}

	override protected void initInterface()              // Initialise user interface.
	{
		auto frame = new Frame(2, ReliefStyle.groove)    // Create a frame.
			.pack(10);                                   // Place the frame.

		auto label = new Label(frame, "Hello There You!")    // Create a label.
			.pack(10);                                   // Place the label.

		auto exitButton = new Button(frame, "Exit")      // Create a button.
			.setCommand(&this.exitCommand)               // Use the callback.
			.pack(10);                                   // Place the button.
	}
}

void main(string[] args)
{
	auto app = new Application();                        // Create the application.
	app.run();                                           // Run the application.
}