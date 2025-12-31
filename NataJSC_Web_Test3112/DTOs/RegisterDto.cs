namespace NataJSC_Web_Test3112.DTOs
{
    public class RegisterDto
    {
        public required string UserName { get; set; }
        public required string Password { get; set; }
        public required string? FullName { get; set; }
        public required string? Email { get; set; }
    }
}
